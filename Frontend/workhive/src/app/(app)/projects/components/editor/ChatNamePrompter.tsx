import { SetStateAction, useState } from "react";
import { LuX, LuMessageSquare } from "react-icons/lu";
import { ProjectFormData } from "../../create/page";

interface ChatNamePrompterProps {
  setIsGroupNamePrompterOpen: React.Dispatch<SetStateAction<"none" | "prompted" | "closed">>
  title: string
  setFormData: React.Dispatch<SetStateAction<ProjectFormData>>
}

export default function ChatNamePrompter({ setIsGroupNamePrompterOpen, title, setFormData }: ChatNamePrompterProps) {
  const textInputStyle = "bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-2.5 text-texts-primary text-sm focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all";
  const labelStyle = "text-xs font-bold text-texts-secondary uppercase tracking-wider block mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-pop">
      <div className="relative bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-2xl w-full max-w-md mx-4 text-center">

        {/* Close Button */}
        <button
          onClick={() => setIsGroupNamePrompterOpen("none")}
          className="absolute top-5 right-5 text-texts-secondary hover:text-texts-primary hover:bg-ui-tertiary/10 p-1.5 rounded-full transition-colors"
        >
          <LuX size={18} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-texts-primary">
          <LuMessageSquare size={22} className="text-buttons" />
          Name Project's Chat Before Saving
        </h2>

        {/* Content */}
        <div className="space-y-5 mb-3">
          <div>
            <label className={labelStyle}>Custom Chat Name</label>
            <input
              type="text"
              placeholder={`e.g. ${title} Hub`}
              className={`${textInputStyle} w-full`}
              autoFocus
              onChange={(e) => setFormData(prev => ({ ...prev, groupName: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsGroupNamePrompterOpen("closed");
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <hr className="flex-1 border-ui-tertiary/20" />
            <span className="text-xs font-bold text-texts-secondary uppercase tracking-wider">OR</span>
            <hr className="flex-1 border-ui-tertiary/20" />
          </div>

          <div className="bg-ui-main/50 rounded-xl p-4 border border-ui-tertiary/10 text-center">
            <p className="text-sm text-texts-secondary mb-3">Skip custom naming and use the group name:</p>
            <p className="text-texts-primary font-semibold">"{title.split(" ", 3).join(" ")}"</p>
          </div>
        </div>

        {/* Call To Action */}
        <button
          onClick={() => setIsGroupNamePrompterOpen("closed")}
          className="px-5 py-2.5 rounded-xl border-2 border-ui-tertiary/20 text-texts-secondary font-medium hover:bg-ui-main hover:text-texts-primary transition-colors text-sm"
        >
          Use Group Name
        </button>

      </div>
    </div>
  );
}
