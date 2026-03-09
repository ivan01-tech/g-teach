"use client";

import { listenToCities, listenToTutors } from "@/lib/thunks/tutors-thunks";
import { use, useEffect } from "react";

export default function Bootstrap() {
  useEffect(() => {
    listenToTutors();
    listenToCities();
  }, []);

  return null;
}
