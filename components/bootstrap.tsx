"use client";

import { listenToTutors } from "@/lib/thunks/tutors-thunks";
import { use, useEffect } from "react";

export default function Bootstrap() {
  useEffect(() => {
    listenToTutors();
  }, []);

  return null;
}
