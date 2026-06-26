"use client";

import { useState } from "react";

const useActiveCategory = (): [string | null, (id: string | null) => void] =>
  useState<string | null>(null);

export default useActiveCategory;
