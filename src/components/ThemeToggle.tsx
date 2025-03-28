import { type FC, useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

import { Switch } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ThemeToggle: FC = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  useEffect(() => {
    //  console.log('isDarkMode', isDarkMode)
    const html = document.getElementsByTagName("html")[0];
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <div>
        <div className="relative bg-slate-200 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                <button type="button" onClick={toggle}>
                  <span className="text-slate-900 dark:text-slate-50">
                    {isDarkMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Moon</title>
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Sun</title>
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>
        {/*  <p>Current theme: {isDarkMode ? 'dark' : 'light'}</p> */}
      </div>
    </>
  );
};
