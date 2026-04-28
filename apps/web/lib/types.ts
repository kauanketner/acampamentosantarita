/**
 * Tipos espelhados dos endpoints /public/* da API.
 * Mantemos uma cópia leve aqui pra não acoplar o Next ao Drizzle.
 */

export type EventStatus =
  | 'rascunho'
  | 'inscricoes_abertas'
  | 'inscricoes_fechadas'
  | 'em_andamento'
  | 'finalizado'
  | 'cancelado';

export type EventType = 'acampamento' | 'retiro' | 'encontro' | 'formacao' | 'outro';

export type PublicEvent = {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  status: EventStatus;
  editionNumber?: number | null;
  startDate: string;
  endDate: string;
  registrationDeadline?: string | null;
  location?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  coverImageUrl?: string | null;
  priceCampista?: string | null;
  priceEquipista?: string | null;
  maxParticipants?: number | null;
};

export type PublicGalleryAlbum = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  photoCount: number;
  event?: { id: string; name: string; startDate: string } | null;
};

export type PublicGalleryPhoto = {
  id: string;
  url: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export type PublicGalleryAlbumDetail = PublicGalleryAlbum & {
  photos: PublicGalleryPhoto[];
};

export type PublicFaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
};
