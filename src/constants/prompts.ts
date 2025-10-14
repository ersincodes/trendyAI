import type { Prompt } from "../types";
import { i18n } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const PROMPTS: Prompt[] = [
  {
    id: 1,
    title: "3D Toy Figurine",
    prompt:
      "Create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment. The figurine is placed on a computer desk. The figurine has a round transparent acrylic base, with no text on the base. The content on the computer screen is a 3D modeling process of this figurine. Next to the computer screen is a toy packaging box, designed in a style reminiscent of high-quality collectible figures, printed with original artwork. The packaging features two-dimensional flat illustrations.",
  },
  {
    id: 2,
    title: "Polaroid Photo",
    prompt:
      "Create a candid, retro Polaroid-style photo of the character, as if taken with an on-camera flash in a dimly lit room. The photo should have a nostalgic, slightly blurry feel like a real snapshot. Do not alter the character's facial features. The background should be simple, like soft white curtains, to keep the focus on the subject. The character should be looking at the camera, captured in a natural moment.",
  },
  {
    id: 3,
    title: "Magazine Cover",
    prompt:
      "Design a glossy magazine cover featuring this person as the star. Include a bold masthead, cover lines, and a glamorous studio photo style. Make it look like a real magazine you'd find on the newsstand.",
  },
  {
    id: 4,
    title: "16-Bit Game Character",
    prompt:
      "Transform this photo into a retro 16-bit video game Sprite. Place the character in a colorful pixelated background with a health bar, score counter, and action stance like a classic side-scrolling game.",
  },
  {
    id: 5,
    title: "Mini Me",
    prompt:
      "Shrink this character down to ant-size and place them in a giant backyard environment. Show them exploring under tall blades of grass or climbing everyday objects that now look massive. Capture the fun perspective of living like an ant.",
  },
  {
    id: 6,
    title: "Museum Bust",
    prompt:
      "Create a masterpiece marble bust in the style of a Renaissance sculptor like Michelangelo. The sculpture must be crafted from a single block of Carrara marble, showing subtle veining and natural stone imperfections. The result must look like solid, intricately carved stone, demonstrating the subsurface scattering effect that gives marble its characteristic luminous quality. It is crucial that the result does NOT look like a photorealistic person or a ceramic figure painted white. Strictly preserve the person’s face and identity exactly as in the uploaded photo — no changes. Also preserve the original clothing from the uploaded photo, sculpted in realistic marble texture with detailed, deep-carved folds, without altering its style or design. The result must always be a bust sculpture (head, shoulders, and chest). The bust is placed on a pedestal with a blank museum label in front, no text or logos. Captured in close-up framing, focusing on the bust and the visitors immediately surrounding it, who are gazing in awe. Shot in candid photography style. Relight the bust to match the ambient museum lighting, with soft spotlights highlighting the detailed marble carving, creating natural contact shadows and subtle reflections. The atmosphere should feel photorealistic, cinematic, and intimate.",
  },
];
