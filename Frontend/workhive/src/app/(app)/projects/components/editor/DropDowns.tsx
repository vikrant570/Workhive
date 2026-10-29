"use client"
import { useEffect, useState } from "react";
import { LuChevronDown, LuTrash2, LuX } from "react-icons/lu";
import { Task } from "../../[id]/page";

//   MEMBERS DROPDOWN  
interface MembersDropDownProps {
    members: partialUserInfo[],
    toggleMember: (member: partialUserInfo) => void,
    selectedMembers: partialUserInfo[],
}
export const MemberDropDown = ({ members, toggleMember, selectedMembers }: MembersDropDownProps) => {
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

// SELECTED MEMBERS OR DEPARTMENTS DROPDOWN'S FOR ASSIGNMENTS 
interface Dept {
    name: string;
    head: string;
}
interface AssignItemsDropDownProps {
    selectedItems: Array<any>;
    setCurrVal: React.Dispatch<React.SetStateAction<any>>
    setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>
    selection: "mem_to_task" | "mem_to_dept" | "dept_to_task"
}
interface TempTask {
    title: string,
    department: string,
    assignedToId: string
}
export const AssignItemsDropDown = ({ selectedItems, setCurrVal, setDropDownOpen, selection }: AssignItemsDropDownProps) => {

    const handleClick = (itemid: string) => {
        if (selection === "mem_to_task") setCurrVal((prev: TempTask) => ({ ...prev, assignedToId: itemid }))
        else if (selection === "mem_to_dept") setCurrVal((prev: { name: string, head: string }) => ({ ...prev, head: itemid }))
        else setCurrVal((prev: TempTask) => ({ ...prev, department: itemid }));

        setDropDownOpen(false);
    }

    const getItemName = (item: any) => {
        if (selection === "dept_to_task") {
            return (item as Dept).name;
        }
        else {
            return (item as partialUserInfo).fullname;
        }
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ui-main border border-ui-tertiary/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
            {selectedItems.length > 0 ? (
                selectedItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => { handleClick(selection === "dept_to_task" ? (item as Dept).name : (item as partialUserInfo)._id) }}
                        className="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-ui-secondary transition-colors"
                    >
                        <div className="w-6 h-6 rounded-full bg-ui-secondary border border-ui-tertiary/20 flex items-center justify-center text-[10px] font-bold">
                            {getItemName(item)[0]}
                        </div>
                        <span className="text-sm">{getItemName(item)}</span>
                    </div>
                ))
            ) : (
                <div className="px-4 py-3 text-xs text-texts-secondary text-center">
                    Select some {selection === "dept_to_task" ? "departments" : "members"} first
                </div>
            )}
        </div>
    )
}

interface SelectedItemsList {
    items: Array<any>,
    selectedMembers: partialUserInfo[],
    setItem: React.Dispatch<React.SetStateAction<any>>
    selection: "task" | "department"
}
export const SelectedItemsList = ({ items, selectedMembers, setItem, selection }: SelectedItemsList) => {

    const getMemberName = (id: string) => selectedMembers.find(m => m._id === id)?.fullname;

    const getItemName = (item: any) => {
        if (selection === "task") {
            return (item as Task).title
        } else {
            return (item as Dept).name;
        }
    }

    const removeItems = (item: any) => {
        if (selection === "task") {
            setItem((prev: Task[]) => prev.filter((t) => t._id !== item._id))
        } else {
            setItem((prev: Dept[]) => prev.filter((d) => d.name !== item.name))
        }
    }

    return (
        items.length > 0 ? (
            <div className={`${selection === "department" ? "grid grid-cols-2 gap-2 max-h-25" : "max-h-50"} space-y-3 overflow-y-scroll custom-scrollbar`}>
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-ui-main border border-ui-tertiary/10 hover:border-buttons/30 transition-all group h-fit">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-ui-secondary flex items-center justify-center text-buttons font-bold text-sm">
                                {getMemberName(selection === "task" ? (item as Task).assignedTo._id : (item as Dept).head)?.[0]}
                            </div>
                            <div>
                                <p className="font-medium text-sm text-texts-primary truncate text-ellipsis max-w-40">{getItemName(item)}</p>
                                <p className="text-xs text-texts-secondary flex items-center gap-1">
                                    {selection === "task" ? "Assigned to" : "Headed by"} <span className="text-texts-primary">
                                        {(selection === "task" ? (item as Task).assignedTo.fullname : getMemberName((item as Dept).head))?.split(" ", 2).join(" ")}
                                        {selection === "task" ? <span> - under department : <b className="text-indigo-400">{(item as Task)?.department}</b></span> : ""}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { removeItems(item) }}
                            className="p-2 text-texts-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LuTrash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-8 border-2 border-dashed border-ui-tertiary/10 rounded-xl text-texts-secondary text-sm">
                No {selection}s added yet. Add {selection}s above.
            </div>
        )
    )
}

interface OpenDropDownButton {
    items: Array<any>,
    setCurrVal: React.Dispatch<React.SetStateAction<any>>
    currVal: any,
    dropdownFor: "mem_to_task" | "dept_to_task" | "mem_to_dept"
}
export const OpenDropDownButton = ({ items, setCurrVal, currVal, dropdownFor }: OpenDropDownButton) => {
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [currValName, setCurrValName] = useState<string>("");

    useEffect(() => {
        if (dropdownFor === "dept_to_task") {
            setCurrValName((currVal as TempTask).department);
        }
        else if (dropdownFor === "mem_to_task") {
            const name = (items as partialUserInfo[]).find((m) => m._id === (currVal as TempTask).assignedToId)?.fullname;
            setCurrValName(name || "");
        }
        else if (dropdownFor === "mem_to_dept") {
            const name = (items as partialUserInfo[]).find((m) => m._id === (currVal as Dept).head)?.fullname;
            setCurrValName(name || "");
        }
    }, [currVal])

    const labelStyle = "text-xs font-bold text-texts-secondary uppercase tracking-wider";

    const setPriorStylings = () => {
        switch (dropdownFor) {
            case "dept_to_task":
                return ({
                    label: "Assign Under a Dept.",
                    contClass: "md:col-span-4"
                })
            case "mem_to_task":
                return ({
                    label: "Assign a Member",
                    contClass: "md:col-span-3"
                })
            case "mem_to_dept":
                return ({
                    label: "Assign Dept. Head",
                    contClass: "md:col-span-6"
                })
        }
    }
    const priorStyle = setPriorStylings();

    return (
        <div className={priorStyle.contClass}>
            <label className={labelStyle}>{priorStyle.label}</label>
            <div className="relative">
                <button
                    onClick={() => setDropDownOpen(!dropDownOpen)}
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-2.5 text-texts-primary text-sm flex items-center justify-between hover:border-buttons/50 transition-all text-left"
                >
                    <span className={currValName === "" ? "text-texts-secondary" : ""}>
                        {
                            currValName !== "" ?
                                <span className="text-texts-primary py-2.5">{currValName}</span>
                                : <span className="text-texts-secondary/90 py-2.5">Select {dropdownFor === "dept_to_task" ? "Department" : "Member"}</span>
                        }
                    </span>
                    <LuChevronDown size={14} className={`transition-transform duration-200 ${dropDownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropDownOpen && (
                    <AssignItemsDropDown selectedItems={items} setCurrVal={setCurrVal} setDropDownOpen={setDropDownOpen} selection={dropdownFor} />
                )}
            </div>
        </div>
    )
}