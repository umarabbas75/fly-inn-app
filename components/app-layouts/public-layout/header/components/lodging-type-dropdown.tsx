"use client";

import {
  setLodgingType,
  setOpenDropdown,
} from "../../../../../redux/slices/filter-slice";
import { RootState } from "../../../../../redux/store";
import { Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";

const lodgingTypes = [
  "Apartment",
  "House",
  "Mansion",
  "Villa",
  "Cottage",
  "Studio",
  "Penthouse",
  "Cabin",
  "Loft",
  "Farmhouse",
];

export default function LodgingTypeDropdown() {
  const { lodgingType, openDropdown } = useSelector(
    (state: RootState) => state.filters
  );
  const dispatch = useDispatch();
  const currentId = "lodging";

  const items = lodgingTypes.map((type) => ({
    key: type,
    label: (
      <div
        onClick={() => {
          dispatch(setLodgingType(type));
          dispatch(setOpenDropdown(null)); // Close dropdown after selection
        }}
        className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
      >
        {type}
      </div>
    ),
  }));

  const handleOpenChange = (open: boolean) => {
    dispatch(setOpenDropdown(open ? currentId : null));
  };

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      popupRender={(menu) => (
        <div className="max-h-[200px] w-[300px] overflow-auto rounded-md shadow-md bg-white">
          {menu}
        </div>
      )}
      open={openDropdown === currentId}
      onOpenChange={handleOpenChange}
    >
      <div
        className={`${
          openDropdown === currentId
            ? "border-gray-200 rounded-full shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)]"
            : ""
        } text-sm text-gray-500 px-4 py-4 hover:bg-gray-200 hover:rounded-full cursor-pointer flex items-center gap-2`}
      >
        <span>{lodgingType || "Lodging type"}</span>
      </div>
    </Dropdown>
  );
}
