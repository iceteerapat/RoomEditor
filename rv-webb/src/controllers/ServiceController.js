import Replicate from "replicate";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Account from "../models/Account.js";
import Service from "../models/Service.js";
import { shrinkImage } from "../services/ShrinkImage.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export const genBasic = async (req, res) => {
  const { prompt, ratio } = req.body;
  const auth = req.headers.authorization;

  try {
    if(!auth || !auth.startsWith('Bearer ')){
      return res.status(404).json({ message: 'Authorization token required, please re-login'});
    } 
    const token = auth.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const customerId = decodedToken.customerId;
    const email = decodedToken.email;
    
    const service = await Service.findOne({ where: {customerId: customerId}});
    if(!service){
      console.log("Cannot find Service in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 
    if(service.credits === 0){
      return res.status(401).json({ message: 'Image Credit is 0, please subscribe or add credit'});
    }
    if(service.serviceAccess === 'N'){
      return res.status(401).json({ message: 'Customer is not allowed to access the service, please re-subscription or paid one at a time'});
    }

    service.credits = service.credits - 1;
    await service.save();

    const account = await Account.findOne({ where: {email: email}})
    if(!account){
      console.log("Cannot find Account in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 

    const prediction = await replicate.predictions.create({
      model: "stability-ai/stable-diffusion-3",
      input: {
        prompt: prompt,
        aspect_ratio: '16:9',
        output_quality: 100,
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

    const gemini = genai.getGenerativeModel({ model: "gemini-2.5-flash" });
    let analysisText;

    try{
        const response = await fetch(upscaledImageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch upscaled image: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`URL did not return an image: ${contentType || 'No Content-Type'}`);
        }
        const imagePart = {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: contentType,
          },
        };
        const prompt = "based on the room's picture provided, give me the infomation of materials that have used in this room, also specific what kind of materials is that, keep focus on on furniture/Floor/Celling/Light and excaptional for decoration,if you don't know give a suggestion";
        const result = await gemini.generateContent([
          prompt, // if you have a text component to your prompt
          imagePart
        ]);
        const geminiResponse = result.response;
        analysisText = geminiResponse.text();
    }catch(error){
      console.error("Error during Gemini analysis:", error);
      return res.status(500).json({
        message: "Failed to analyze the upscaled image with Gemini.",
        details: error.message
      });
    }

    const payload = {
      email: account.email,
      username: account.username,
      customerId: service.customerId,
      productName: service.productName,
      credits: service.credits
    }

    const newAccessToken = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '1h' } // Your desired access token expiry
    );

    console.log("image generate successfully: ", customerId, service.credits)
    res.status(200).json({ image: upscaledImageUrl, analysis: analysisText, token: newAccessToken });

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
      return res.status(404).json({ message: 'Authorization token required, please re-login'});
    } 
    const token = auth.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const customerId = decodedToken.customerId;
    const email = decodedToken.email;

    const service = await Service.findOne({ where: {customerId: customerId}});
    if(!service){
      console.log("Cannot find Service in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 
    if(service.credits === 0){
      return res.status(401).json({ message: 'Image Credit is 0, please subscribe or add credit'});
    }
    if(service.serviceAccess === 'N'){
      return res.status(401).json({ message: 'Customer is not allowed to access the service, please re-subscription or paid one at a time'});
    }

    service.credits = service.credits - 1;
    await service.save();

    const account = await Account.findOne({ where: {email: email}})
    if(!account){
      console.log("Cannot find Account in database.")
      return res.status(500).json({ message: 'Internal Server Error'});
    } 

    const resizedBase64Image = await shrinkImage(imageProps); 
    const prediction = await replicate.predictions.create({
      model: "stability-ai/stable-diffusion-3",
      input: {
        prompt: prompt,
        image: resizedBase64Image,
        aspect_ratio: '16:9',
        output_quality: 100,
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
    
    const gemini = genai.getGenerativeModel({ model: "gemini-2.5-flash" });
    let analysisText;

    try{
        const response = await fetch(upscaledImageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch upscaled image: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`URL did not return an image: ${contentType || 'No Content-Type'}`);
        }
        const imagePart = {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: contentType,
          },
        };
        const prompt = "based on the room's picture provided, give me the infomation of materials that have used in this room, also specific what kind of materials is that, keep focus on on furniture/Floor/Celling/Light and excaptional for decoration,if you don't know give a suggestion";
        const result = await gemini.generateContent([
          prompt, // if you have a text component to your prompt
          imagePart
        ]);
        const geminiResponse = result.response;
        analysisText = geminiResponse.text();
    }catch(error){
      console.error("Error during Gemini analysis:", error);
      return res.status(500).json({
        message: "Failed to analyze the upscaled image with Gemini.",
        details: error.message
      });
    }

    const payload = {
      email: account.email,
      username: account.username,
      customerId: service.customerId,
      productName: service.productName,
      credits: service.credits
    }

    const newAccessToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' } // Your desired access token expiry
    );

    console.log("image generate successfully: ", customerId, service.credits)
    res.status(200).json({ image: upscaledImageUrl, analysis: analysisText, token: newAccessToken });

  } catch (error) {
    console.error("API call failed in try-catch block:", error);
    res.status(500).json({ message: "API call failed", details: error.message });
  }
};