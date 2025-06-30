// 📁 /lib/geoCheck.js
import axios from "axios";

const ABSTRACT_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_API_KEY;

export async function getUserRegion() {
  try {
    const res = await axios.get(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}`
    );
    return res.data; // includes country, region, city, etc.
  } catch (err) {
    console.error("Geo lookup failed:", err);
    return null;
  }
}