import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import { TemplateGallery } from "@/pages/template-gallery";
import { TestBench } from "@/pages/test-bench";
import { FlavorProvider } from "@/providers/flavor-provider";
import { RouteProvider } from "@/providers/router-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <FlavorProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/templates" element={<TemplateGallery />} />
                        <Route path="/test" element={<TestBench />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </FlavorProvider>
    </StrictMode>,
);
