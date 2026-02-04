import React, { useContext, useReducer, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ThemeContext } from "../../Context/ThemeContext.jsx";

// Policy filters component
const initial = {
  q: "",
  status: "ALL",
  type: "ALL",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_Q":
      return { ...state, q: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "RESET":
      return initial;
    default:
      return state;
  }
}

export default function PolicyFilters({ onChange }) {
  const { theme } = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  // Options for Status and Type
  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Expired", value: "EXPIRED" },
  ];

  const typeOptions = [
    { label: "All", value: "ALL" },
    { label: "Health", value: "health" },
    { label: "Life", value: "life" },
    { label: "Car", value: "car" },
    { label: "Bike", value: "bike" },
    { label: "Travel", value: "travel" },
    { label: "Air Pass", value: "airpass" },
  ];

  // Helpers to show current label
  const statusLabel =
    statusOptions.find((o) => o.value === state.status)?.label ?? "All";
  const typeLabel =
    typeOptions.find((o) => o.value === state.type)?.label ?? "All";

  return (
    <div className="rounded-card border border-borderDefault bg-bgCard dark:bg-gray-800 dark:border-gray-700 shadow-sm mb-3">
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-2">
          {/* Search */}
          <div className="md:col-span-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-textInverted" : "text-textSecondary"
              }`}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Policy Title or Type"
              value={state.q}
              onChange={(e) =>
                dispatch({ type: "SET_Q", payload: e.target.value })
              }
              className={`w-full rounded-md border border-borderDefault px-3 py-2 text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                theme === "dark"
                  ? "bg-gray-700 text-textInverted border-gray-600"
                  : "bg-bgBase text-textPrimary"
              }`}
            />
          </div>

          {/* Status (Headless UI Listbox) */}
          <div className="md:col-span-3">
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-textInverted" : "text-textSecondary"
              }`}
            >
              Status
            </label>

            <Listbox
              value={state.status}
              onChange={(val) => dispatch({ type: "SET_STATUS", payload: val })}
            >
              <div className="relative">
                {/* Closed control */}
                <Listbox.Button
                  className={`
                    w-full rounded-lg border border-borderDefault
                    px-3 py-2 pr-9 text-sm
                    transition-all duration-200 ease-out
                    hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                    flex items-center justify-between
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-textInverted border-gray-600 hover:bg-gray-700/80"
                        : "bg-bgBase text-textPrimary hover:bg-bgHover/40"
                    }
                  `}
                >
                  <span className="truncate">{statusLabel}</span>
                  <i
                    className={`bi bi-chevron-down text-base ${
                      theme === "dark"
                        ? "text-textInverted"
                        : "text-textSecondary"
                    }`}
                  />
                </Listbox.Button>

                {/* Popup menu */}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    className={`
                      absolute z-20 mt-1 w-full
                      rounded-lg border border-borderDefault shadow-lg
                      overflow-hidden
                      focus:outline-none
                      ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-bgBase"
                      }
                    `}
                  >
                    {statusOptions.map((opt) => (
                      <Listbox.Option
                        key={opt.value}
                        value={opt.value}
                        className={({ active, selected }) =>
                          `
                          cursor-pointer select-none px-3 py-2 text-sm
                          ${
                            active
                              ? theme === "dark"
                                ? "bg-gray-600"
                                : "bg-bgHover/60"
                              : ""
                          }
                          ${
                            selected
                              ? "bg-primary/10 text-primary"
                              : theme === "dark"
                                ? "text-textInverted"
                                : "text-textPrimary"
                          }
                        `
                        }
                      >
                        {opt.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Type (Headless UI Listbox) */}
          <div className="md:col-span-3">
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-textInverted" : "text-textSecondary"
              }`}
            >
              Type
            </label>

            <Listbox
              value={state.type}
              onChange={(val) => dispatch({ type: "SET_TYPE", payload: val })}
            >
              <div className="relative">
                {/* Closed control */}
                <Listbox.Button
                  className={`
                    w-full rounded-lg border border-borderDefault
                    px-3 py-2 pr-9 text-sm
                    transition-all duration-200 ease-out
                    hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                    flex items-center justify-between
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-textInverted border-gray-600 hover:bg-gray-700/80"
                        : "bg-bgBase text-textPrimary hover:bg-bgHover/40"
                    }
                  `}
                >
                  <span className="truncate">{typeLabel}</span>
                  <i
                    className={`bi bi-chevron-down text-base ${
                      theme === "dark"
                        ? "text-textInverted"
                        : "text-textSecondary"
                    }`}
                  />
                </Listbox.Button>

                {/* Popup menu */}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    className={`
                      absolute z-20 mt-1 w-full
                      rounded-lg border border-borderDefault shadow-lg
                      overflow-hidden
                      focus:outline-none
                      ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-bgBase"
                      }
                    `}
                  >
                    {typeOptions.map((opt) => (
                      <Listbox.Option
                        key={opt.value}
                        value={opt.value}
                        className={({ active, selected }) =>
                          `
                          cursor-pointer select-none px-3 py-2 text-sm
                          ${
                            active
                              ? theme === "dark"
                                ? "bg-gray-600"
                                : "bg-bgHover/60"
                              : ""
                          }
                          ${
                            selected
                              ? "bg-primary/10 text-primary"
                              : theme === "dark"
                                ? "text-textInverted"
                                : "text-textPrimary"
                          }
                        `
                        }
                      >
                        {opt.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Reset */}
          <div className="md:col-span-2">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              type="button"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md border border-borderDefault px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                theme === "dark"
                  ? "text-textInverted hover:bg-gray-700 border-gray-600"
                  : "text-textSecondary hover:bg-bgHover"
              }`}
            >
              <i className="bi bi-arrow-counterclockwise" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
