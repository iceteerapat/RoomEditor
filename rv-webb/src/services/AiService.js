import Replicate from "replicate";
import dotenv from 'dotenv';

dotenv.config();
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export const genBasic = async (req, res) => {
  const { prompt, ratio } = req.body;
  try {
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
        error: "Base image generation failed or produced no output.",
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
        error: "Upscaling failed or produced no valid URL output.",
        details: upscaleResult.error || `Prediction status: ${upscaleResult.status}`
      });
    }
    const upscaledImageUrl = upscaleResult.output;

    if (!upscaledImageUrl) {
      return res.status(500).json({ error: "Upscaling failed: no valid upscaled image URL found" });
    }

    res.status(200).json({ image: upscaledImageUrl });

  } catch (error) {
    console.error("API call failed in try-catch block:", error);
    res.status(500).json({ error: "API call failed", details: error.message });
  }
};