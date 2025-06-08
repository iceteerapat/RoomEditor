import Replicate from "replicate";
import dotenv from 'dotenv';

dotenv.config();
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export const genBasic = async(req, res) => {
    const { prompt, ratio } = req.body;
    try {
      const prediction = await replicate.predictions.create({
          model: "stability-ai/stable-diffusion-3",
          input: {
            prompt: prompt ,
            aspect_ratio: ratio
          }
        }
      );

      let result = prediction;
      const maxAttempts = 20;
      let attempts = 0;

      while (
        attempts < maxAttempts &&
        ["starting", "processing"].includes(result.status)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = await replicate.predictions.get(prediction.id);
        attempts++;
      }

      if (result.status !== "succeeded" || !Array.isArray(result.output)) {
        console.log(result.status);
      } 

      const baseImageUrl = result.output[0];

      const upscaleResult = await replicate.run(
      "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        {
          input: {
            image: baseImageUrl,
            scale: 2,
          },
        }
      );
      const upscaledImageUrl = upscaleResult;
      if (!upscaledImageUrl) {
        return res.status(500).json({ error: "Upscaling failed" });
      }
      res.json({ image: upscaledImageUrl});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "API call failed", details: error.message });
    }
}

export const genPro = async(req, res) => {

}

export const genPremium = async(req, res) => {

}