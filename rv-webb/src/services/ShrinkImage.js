import sharp from 'sharp';

export async function shrinkImage(base64String) {
    try {
        const base64Data = base64String.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const resize = await sharp(imageBuffer)
        .resize(1024,768, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .jpeg({quality: 80})
        .toBuffer();
        return `data:image/jpeg;base64,${resize.toString('base64')}`;
    }catch(error){
        console.log("Error shrink image service: ", error)
    }
}