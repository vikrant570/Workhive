"use client"
import { LuCircleCheck, LuX } from "react-icons/lu";

interface Props {
    members: partialUserInfo[],
    toggleMember: (member: partialUserInfo) => void,
    selectedMembers: partialUserInfo[],
}

const MemberDropDown = ({ members, toggleMember, selectedMembers }: Props) => {
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ui-main border border-ui-tertiary/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
            {
                members.map(member => {
                    const isSelected = selectedMembers.some(m => m._id === member._id);
                    return (
                        <div
                            key={member._id}
                            onClick={() => !isSelected && toggleMember(member)}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-ui-secondary transition-colors ${isSelected ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-ui-secondary border border-ui-tertiary/20 flex items-center justify-center text-xs font-bold">
                                    {member.fullname[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{member.fullname}</p>
                                    <p className="text-[10px] text-texts-secondary">{member.username}</p>
                                </div>
                            </div>
                            {isSelected && <LuX size={16} className="text-texts-secondary" onClick={(e) => { e.stopPropagation(); toggleMember(member) }} />}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MemberDropDown;