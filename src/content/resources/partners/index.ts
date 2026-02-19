import { PartnerOrganization } from '../types';
import { nationalPartners } from './national';
import { kentuckyPartners } from './kentucky';
import { ohioPartners } from './ohio';
import { indianaPartners } from './indiana';
import { tennesseePartners } from './tennessee';

const partnersByState: Record<string, PartnerOrganization[]> = {
  KY: kentuckyPartners,
  OH: ohioPartners,
  IN: indianaPartners,
  TN: tennesseePartners,
};

export function getPartnersByState(stateCode: string): PartnerOrganization[] {
  const statePartners = partnersByState[stateCode] || [];
  const adaptedNational = nationalPartners.map(partner => ({
    ...partner,
    relevantPrograms: partner.relevantPrograms.map(id =>
      id.startsWith('federal-')
        ? id.replace('federal-', `${stateCode.toLowerCase()}-`)
        : id
    ),
  }));
  return [...statePartners, ...adaptedNational];
}

export { nationalPartners } from './national';
export { kentuckyPartners } from './kentucky';
export { ohioPartners } from './ohio';
export { indianaPartners } from './indiana';
export { tennesseePartners } from './tennessee';
