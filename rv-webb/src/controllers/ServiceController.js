import Replicate from "replicate";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AccountService from "../models/rvAccountService.js";
import { shrinkImage } from "../services/ShrinkImage.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export const genBasic = async (req, res) => {
  const { prompt, ratio } = req.body;
  const auth = req.headers.authorization;

  try {
    if(!auth || !auth.startsWith('Bearer ')){
      return res.status(401).json({ message: 'Authorization token required'});
    } 
    const token = auth.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const customerId = decodedToken.customerId;
    
    const service = await AccountService.findOne({ where: {customerId: customerId}});
    if(!service){
      console.log("Cannot find AccountService in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 
    if(service.imageGenerated === 0){
      return res.status(401).json({ message: 'Image Credit is 0, please subscribe or add credit'});
    }
    if(service.serviceAccess === 'N'){
      return res.status(401).json({ message: 'Customer is not allowed to access the service, please re-subscription or paid one at a time'});
    }

    service.imageGenerated = service.imageGenerated - 1;
    await service.save();

    const prediction = await replicate.predictions.create({
      model: "stability-ai/stable-diffusion-3",
      input: {
        prompt: prompt,
        aspect_ratio: '16:9',
      },
    });

    let result = prediction;
    const maxAttempts = 180; 
    let attempts = 0;
    const pollInterval = 1000; 

    while (
      attempts < maxAttempts &&
      ["starting", "processing"].includes(result.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      result = await replicate.predictions.get(prediction.id);
      attempts++;
    }

    if (result.status !== "succeeded" || !Array.isArray(result.output) || result.output.length === 0) {
      return res.status(500).json({
        message: "Base image generation failed or produced no output.",
        details: result.error || `Prediction status: ${result.status}`
      });
    }

    const baseImageUrl = result.output[0];

    if (!baseImageUrl) {
        return res.status(500).json({ message: "Base image URL is null or undefined after generation." });
    }

    const upscalePrediction = await replicate.predictions.create({
      version: "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      input: {
        image: baseImageUrl,
        scale: ratio,
      },
    });

    let upscaleResult = upscalePrediction;
    let upscaleAttempts = 0;

    while (
      upscaleAttempts < maxAttempts && 
      ["starting", "processing"].includes(upscaleResult.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      upscaleResult = await replicate.predictions.get(upscalePrediction.id);
      upscaleAttempts++;
    }

    if (upscaleResult.status !== "succeeded" || typeof upscaleResult.output !== 'string' || !upscaleResult.output) {
      return res.status(500).json({
        message: "Upscaling failed or produced no valid URL output.",
        details: upscaleResult.error || `Prediction status: ${upscaleResult.status}`
      });
    }
    const upscaledImageUrl = upscaleResult.output;

    if (!upscaledImageUrl) {
      return res.status(500).json({ message: "Upscaling failed: no valid upscaled image URL found" });
    }

    const payload = {
      email: service.email,
      username: service.username,
      customerId: service.customerId,
      serviceName: service.serviceName,
      imageGenerated: service.imageGenerated
    }

    const newAccessToken = jwt.sign(
    payload,
    JWT_ACCESS_SECRET,
    { expiresIn: '1h' } // Your desired access token expiry
    );

    console.log("image generate successfully: ", customerId, service.imageGenerated)
    res.status(200).json({ image: upscaledImageUrl, token: newAccessToken });

  } catch (error) {
    console.error("API call failed in try-catch block:", error);
    res.status(500).json({ message: "API call failed", details: error.message });
  }
};

export const renovateBasic = async (req, res) => {
  const { prompt, imageProps, ratio } = req.body;
    const auth = req.headers.authorization;

  try {
    if(!auth || !auth.startsWith('Bearer ')){
      return res.status(401).json({ message: 'Authorization token required'});
    } 
    const token = auth.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const customerId = decodedToken.customerId;
    
    const service = await AccountService.findOne({ where: {customerId: customerId}});
    if(!service){
      console.log("Cannot find AccountService in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 
    if(service.imageGenerated === 0){
      return res.status(401).json({ message: 'Image Credit is 0, please subscribe or add credit'});
    }
    if(service.serviceAccess === 'N'){
      return res.status(401).json({ message: 'Customer is not allowed to access the service, please re-subscription or paid one at a time'});
    }

    service.imageGenerated = service.imageGenerated - 1;
    await service.save();

    const resizedBase64Image = await shrinkImage(imageProps); 
    const prediction = await replicate.predictions.create({
      model: "stability-ai/stable-diffusion-3",
      input: {
        prompt: prompt,
        image: resizedBase64Image,
        aspect_ratio: '16:9',
      },
    });

    let result = prediction;
    const maxAttempts = 180; 
    let attempts = 0;
    const pollInterval = 1000; 

    while (
      attempts < maxAttempts &&
      ["starting", "processing"].includes(result.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      result = await replicate.predictions.get(prediction.id);
      attempts++;
    }

    if (result.status !== "succeeded" || !Array.isArray(result.output) || result.output.length === 0) {
      return res.status(500).json({
        message: "Base image generation failed or produced no output.",
        details: result.error || `Prediction status: ${result.status}`
      });
    }

    const baseImageUrl = result.output[0];

    if (!baseImageUrl) {
        return res.status(500).json({ error: "Base image URL is null or undefined after generation." });
    }

    const upscalePrediction = await replicate.predictions.create({
      version: "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      input: {
        image: baseImageUrl,
        scale: ratio,
      },
    });

    let upscaleResult = upscalePrediction;
    let upscaleAttempts = 0;

    while (
      upscaleAttempts < maxAttempts && 
      ["starting", "processing"].includes(upscaleResult.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      upscaleResult = await replicate.predictions.get(upscalePrediction.id);
      upscaleAttempts++;
    }

    if (upscaleResult.status !== "succeeded" || typeof upscaleResult.output !== 'string' || !upscaleResult.output) {
      return res.status(500).json({
        message: "Upscaling failed or produced no valid URL output.",
        details: upscaleResult.error || `Prediction status: ${upscaleResult.status}`
      });
    }
    const upscaledImageUrl = upscaleResult.output;

    if (!upscaledImageUrl) {
      return res.status(500).json({ message: "Upscaling failed: no valid upscaled image URL found" });
    }

    const payload = {
      email: service.email,
      username: service.username,
      customerId: service.customerId,
      serviceName: service.serviceName,
      imageGenerated: service.imageGenerated
    }

    const newAccessToken = jwt.sign(
      payload,
      JWT_ACCESS_SECRET,
      { expiresIn: '1h' } // Your desired access token expiry
    );

    console.log("image generate successfully: ", customerId, service.imageGenerated)
    res.status(200).json({ image: upscaledImageUrl, token: newAccessToken });

  } catch (error) {
    console.error("API call failed in try-catch block:", error);
    res.status(500).json({ message: "API call failed", details: error.message });
  }
};