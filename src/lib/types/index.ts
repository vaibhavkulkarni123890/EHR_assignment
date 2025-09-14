/* eslint-disable @typescript-eslint/no-empty-object-type */
// Patient Types
export interface Patient {
  id: string;
  name: {
    family: string;
    given: string[];
  }[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  address?: Address[];
  telecom?: ContactPoint[];
  active: boolean;
  maritalStatus?: CodeableConcept;
  generalPractitioner?: Reference[];
}

export interface Address {
  use: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type: 'postal' | 'physical' | 'both';
  line: string[];
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ContactPoint {
  system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value: string;
  use: 'home' | 'work' | 'temp' | 'old' | 'mobile';
}

// Appointment Types
export interface Appointment {
  id: string;
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error' | 'checked-in' | 'waitlist';
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  start: string;
  end: string;
  minutesDuration?: number;
  slot?: Reference[];
  created?: string;
  comment?: string;
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

export interface AppointmentParticipant {
  type?: CodeableConcept[];
  actor?: Reference;
  required: 'required' | 'optional' | 'information-only';
  status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  period?: Period;
}

// Clinical Types
export interface Observation {
  id: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
}

// Common FHIR Types
export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface Reference {
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}

export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Quantity {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface Range {
  low?: Quantity;
  high?: Quantity;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface SampledData {
  origin: Quantity;
  period: number;
  factor?: number;
  lowerLimit?: number;
  upperLimit?: number;
  dimensions: number;
  data?: string;
}

// API Response Types
export interface Bundle<T = unknown> {
  resourceType: 'Bundle';
  id?: string;
  meta?: Meta;
  implicitRules?: string;
  language?: string;
  identifier?: Identifier;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  timestamp?: string;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry<T>[];
  signature?: Signature;
}

export interface BundleEntry<T = unknown> {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  link?: BundleLink[];
  fullUrl?: string;
  resource?: T;
  search?: BundleEntrySearch;
  request?: BundleEntryRequest;
  response?: BundleEntryResponse;
}

export interface BundleLink {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  relation: string;
  url: string;
}

export interface BundleEntrySearch {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  mode?: 'match' | 'include' | 'outcome';
  score?: number;
}

export interface BundleEntryRequest {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  ifNoneMatch?: string;
  ifModifiedSince?: string;
  ifMatch?: string;
  ifNoneExist?: string;
}

export interface BundleEntryResponse {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  status: string;
  location?: string;
  etag?: string;
  lastModified?: string;
  outcome?: Resource;
}

export interface Meta {
  id?: string;
  extension?: Extension[];
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: Coding[];
  tag?: Coding[];
}

export interface Extension {
  id?: string;
  extension?: Extension[];
  url: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
}

export interface Resource {
  id?: string;
  meta?: Meta;
  implicitRules?: string;
  language?: string;
  resourceType: string;
}

export interface Signature {
  id?: string;
  extension?: Extension[];
  type: Coding[];
  when: string;
  who: Reference;
  onBehalfOf?: Reference;
  targetFormat?: string;
  sigFormat?: string;
  data?: string;
}

// Additional supporting types
export interface Age extends Quantity {}
export interface Count extends Quantity {}
export interface Distance extends Quantity {}
export interface Duration extends Quantity {}
export interface Money extends Quantity {}

export interface Annotation {
  id?: string;
  extension?: Extension[];
  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface Attachment {
  id?: string;
  extension?: Extension[];
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export interface HumanName {
  id?: string;
  extension?: Extension[];
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export interface Timing {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  event?: string[];
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export interface TimingRepeat {
  id?: string;
  extension?: Extension[];
  boundsDuration?: Duration;
  boundsRange?: Range;
  boundsPeriod?: Period;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  dayOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  timeOfDay?: string[];
  when?: ('MORN' | 'MORN.early' | 'MORN.late' | 'NOON' | 'AFT' | 'AFT.early' | 'AFT.late' | 'EVE' | 'EVE.early' | 'EVE.late' | 'NIGHT' | 'PHS' | 'HS' | 'WAKE' | 'C' | 'CM' | 'CD' | 'CV' | 'AC' | 'ACM' | 'ACD' | 'ACV' | 'PC' | 'PCM' | 'PCD' | 'PCV')[];
  offset?: number;
}

export interface ContactDetail {
  id?: string;
  extension?: Extension[];
  name?: string;
  telecom?: ContactPoint[];
}

export interface Contributor {
  id?: string;
  extension?: Extension[];
  type: 'author' | 'editor' | 'reviewer' | 'endorser';
  name: string;
  contact?: ContactDetail[];
}

export interface DataRequirement {
  id?: string;
  extension?: Extension[];
  type: string;
  profile?: string[];
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  mustSupport?: string[];
  codeFilter?: DataRequirementCodeFilter[];
  dateFilter?: DataRequirementDateFilter[];
  limit?: number;
  sort?: DataRequirementSort[];
}

export interface DataRequirementCodeFilter {
  id?: string;
  extension?: Extension[];
  path?: string;
  searchParam?: string;
  valueSet?: string;
  code?: Coding[];
}

export interface DataRequirementDateFilter {
  id?: string;
  extension?: Extension[];
  path?: string;
  searchParam?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  valueDuration?: Duration;
}

export interface DataRequirementSort {
  id?: string;
  extension?: Extension[];
  path: string;
  direction: 'ascending' | 'descending';
}

export interface Expression {
  id?: string;
  extension?: Extension[];
  description?: string;
  name?: string;
  language: string;
  expression?: string;
  reference?: string;
}

export interface ParameterDefinition {
  id?: string;
  extension?: Extension[];
  name?: string;
  use: 'in' | 'out';
  min?: number;
  max?: string;
  documentation?: string;
  type: string;
  profile?: string;
}

export interface RelatedArtifact {
  id?: string;
  extension?: Extension[];
  type: 'documentation' | 'justification' | 'citation' | 'predecessor' | 'successor' | 'derived-from' | 'depends-on' | 'composed-of';
  label?: string;
  display?: string;
  citation?: string;
  url?: string;
  document?: Attachment;
  resource?: string;
}

export interface TriggerDefinition {
  id?: string;
  extension?: Extension[];
  type: 'named-event' | 'periodic' | 'data-changed' | 'data-added' | 'data-modified' | 'data-removed' | 'data-accessed' | 'data-access-ended';
  name?: string;
  timingTiming?: Timing;
  timingReference?: Reference;
  timingDate?: string;
  timingDateTime?: string;
  data?: DataRequirement[];
  condition?: Expression;
}

export interface UsageContext {
  id?: string;
  extension?: Extension[];
  code: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
}

export interface Dosage {
  id?: string;
  extension?: Extension[];
  modifierExtension?: Extension[];
  sequence?: number;
  text?: string;
  additionalInstruction?: CodeableConcept[];
  patientInstruction?: string;
  timing?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: DosageDoseAndRate[];
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

export interface DosageDoseAndRate {
  id?: string;
  extension?: Extension[];
  type?: CodeableConcept;
  doseRange?: Range;
  doseQuantity?: Quantity;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}

// API Configuration Types
export interface EpicAPIConfig {
  baseURL: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  timeout: number;
}

// Authentication Types
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

// Search Parameters
export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

// Response wrapper for consistency
export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}
