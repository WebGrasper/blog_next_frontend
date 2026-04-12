import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC || "public_v0j9tK3PYBZ+w4xIE1L83wyw1f0=",
  privateKey: process.env.IMAGEKIT_SECRET || "private_SETXKsfjPM6s1VGhHIGm78GtXc4=",
  urlEndpoint: process.env.IMAGEKIT_URL || "https://ik.imagekit.io/94nzrpaata"
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { file, fileName } = req.body;
      
      if (!file) {
        return res.status(400).json({ success: false, error: "No file provided" });
      }

      const response = await imagekit.upload({
        file,
        fileName: fileName || "article_image.png",
        folder: "/blog_articles" // Optional folder organization
      });

      res.status(200).json({ success: true, url: response.url });
    } catch (error) {
      console.error("Image upload failed:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to upload" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
