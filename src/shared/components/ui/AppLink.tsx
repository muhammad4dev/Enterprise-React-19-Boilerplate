import { Link, useParams, type LinkProps } from "@tanstack/react-router";
import * as React from "react";

// Using forwardRef to ensure it works correctly when passed as a 'component' prop to MUI components
export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const params = useParams({ strict: false });
    const currentLang = (params as unknown as { lang?: string })?.lang;

    return (
      <Link
        {...props}
        ref={ref}
        params={
          {
            lang: currentLang,
            ...((props.params || {}) as object),
          } as object
        }
      />
    );
  },
);

AppLink.displayName = "AppLink";
