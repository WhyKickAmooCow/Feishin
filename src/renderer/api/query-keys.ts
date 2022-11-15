import { AlbumListParams } from './albums.api';

export const queryKeys = {
  albums: {
    detail: (albumId: string) => ['albums', albumId] as const,
    list: (serverId: string, params: AlbumListParams) =>
      [serverId, 'albums', 'list', params] as const,
    root: ['albums'],
    songList: (albumId: string) => ['albums', albumId, 'songs'] as const,
  },
  genres: {
    list: (serverId: string) => [serverId, 'genres', 'list'] as const,
    root: (serverId: string) => [serverId, 'genres'] as const,
  },
  ping: (url: string) => ['ping', url] as const,
  server: {
    root: (serverId: string) => [serverId] as const,
  },
  servers: {
    list: (params?: any) => ['servers', 'list', params] as const,
    map: () => ['servers', 'map'] as const,
    root: ['servers'],
  },
  tasks: {
    list: () => ['tasks', 'list'] as const,
    root: ['tasks'],
  },
  users: {
    detail: (userId: string) => ['users', userId] as const,
    list: (params?: any) => ['users', 'list', params] as const,
    root: ['users'],
  },
};
