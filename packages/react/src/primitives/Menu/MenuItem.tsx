import * as React from 'react';
import classNames from 'classnames';

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ComponentClassNames } from '../shared/constants';
import { MenuButton } from './MenuButton';
import { MenuItemProps } from '../types';

export const MenuItem = React.forwardRef<
  HTMLDivElement,
  MenuItemProps & { children?: React.ReactNode }
>(({ children, className, variation, ...rest }, ref) => {
  return (
    <DropdownMenuItem asChild={true} ref={ref}>
      <MenuButton
        className={classNames(ComponentClassNames.MenuItem, className)}
        {...rest}
        variation="menu" // ensures `menu` variation
      >
        {children}
      </MenuButton>
    </DropdownMenuItem>
  );
});
