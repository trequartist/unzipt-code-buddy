import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Workspace navigation (Ctrl+1-4)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            navigate("/create");
            break;
          case "2":
            e.preventDefault();
            navigate("/strategy");
            break;
          case "3":
            e.preventDefault();
            navigate("/intelligence");
            break;
          case "4":
            e.preventDefault();
            navigate("/hub");
            break;
          case "s":
            e.preventDefault();
            // Trigger save action
            console.log("Save shortcut triggered");
            break;
          case "/":
            e.preventDefault();
            // Focus assistant panel
            const assistantInput = document.querySelector(
              'textarea[placeholder*="Ask me"]'
            ) as HTMLTextAreaElement;
            if (assistantInput) {
              assistantInput.focus();
            }
            break;
        }
      }

      // Escape to close dialogs/modals
      if (e.key === "Escape") {
        // Let the native dialog handlers manage this
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
