import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import config from '@config/freeform/freeform.config';
import { getButtonGroups } from '@editor/builder/tabs/layout/field-layout/page/page-buttons/page-buttons.operations';
import { useLastTab } from '@editor/builder/tabs/tabs.hooks';
import type { Page, PageButton } from '@editor/builder/types/layout';
import { buttonRuleSelectors } from '@editor/store/slices/rules/buttons/buttons.selectors';
import type { PageButtonType } from '@ff-client/types/rules';
import classes from '@ff-client/utils/classes';
import translate from '@ff-client/utils/translations';

import { Button, ButtonGroup, ButtonsWrapper } from './buttons.styles';

type Props = {
  page: Page;
};

type ButtonItemProps = {
  page: Page;
  button: PageButton;
};

const ButtonItem: React.FC<ButtonItemProps> = ({
  page,
  button: { handle, label },
}) => {
  const canEdit = config.limitations.can('rules.tab.buttons');
  const { uid, button: currentButton } = useParams();
  const navigate = useNavigate();
  const { setLastTab } = useLastTab('rules');

  const currentPage = uid === page.uid && handle === currentButton;
  const hasRule = useSelector(
    buttonRuleSelectors.hasRule(page.uid, handle as PageButtonType)
  );

  if (!canEdit) {
    return null;
  }

  return (
    <Button
      type="button"
      className={classes(
        handle,
        currentPage && 'active',
        hasRule && 'has-rule'
      )}
      onClick={() => {
        const tab = currentPage ? '' : `page/${page.uid}/buttons/${handle}`;
        setLastTab(tab);
        navigate(tab);
      }}
    >
      {translate(label)}
    </Button>
  );
};

export const Buttons: React.FC<Props> = ({ page }) => {
  const buttonGroups = getButtonGroups(page);

  return (
    <ButtonsWrapper>
      {buttonGroups.map((group, index) => (
        <ButtonGroup key={index} className="page-buttons">
          {group.map((button, index) => (
            <ButtonItem key={index} button={button} page={page} />
          ))}
        </ButtonGroup>
      ))}
    </ButtonsWrapper>
  );
};
