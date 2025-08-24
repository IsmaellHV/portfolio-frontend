import React from 'react';
import { BreadCrumb as SharedBreadCrumb } from '../../../shared/Components/Element/BreadCrumb/View';
import { ENVIRONMENT } from '../../../../env';

interface Props {
  schemaCreateSpace?: string;
  schema?: string;
  entity?: string;
  schemaDesc?: string;
  entityDesc?: string;
  className?: string;
}

export const BreadCrumb: React.FC<Props> = ({
  schemaCreateSpace,
  schema,
  //eslint-disable-next-line
  entity,
  schemaDesc,
  entityDesc,
  className,
}) => {
  // Create breadcrumb list based on the schema hierarchy
  const breadcrumbList = [];

  // Add schema level (Games)
  if (schemaDesc && schema) {
    breadcrumbList.push({
      text: schemaDesc,
      navigate: true,
      path: `/${schema.toLowerCase()}`,
    });
  }

  // Add entity level (current game)
  if (entityDesc) {
    breadcrumbList.push({
      text: entityDesc,
      navigate: false,
      path: '',
    });
  }

  // Default home path for games
  const homePath = schemaCreateSpace || ENVIRONMENT.ROUTE.INSPIREHUBGAMES;

  return <SharedBreadCrumb list={breadcrumbList} home={homePath} className={className} />;
};
