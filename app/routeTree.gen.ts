/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as OnboardImport } from './routes/onboard'
import { Route as AppImport } from './routes/_app'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as AppHandleIndexImport } from './routes/_app/$handle/index'
import { Route as AppAlbumAlbumIdIndexImport } from './routes/_app/album/$albumId/index'

// Create Virtual Routes

const AppTermsLazyImport = createFileRoute('/_app/terms')()
const AppRoadmapLazyImport = createFileRoute('/_app/roadmap')()
const AppPrivacyPolicyLazyImport = createFileRoute('/_app/privacy-policy')()

// Create/Update Routes

const OnboardRoute = OnboardImport.update({
  path: '/onboard',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppTermsLazyRoute = AppTermsLazyImport.update({
  path: '/terms',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/terms.lazy').then((d) => d.Route))

const AppRoadmapLazyRoute = AppRoadmapLazyImport.update({
  path: '/roadmap',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/roadmap.lazy').then((d) => d.Route))

const AppPrivacyPolicyLazyRoute = AppPrivacyPolicyLazyImport.update({
  path: '/privacy-policy',
  getParentRoute: () => AppRoute,
} as any).lazy(() =>
  import('./routes/_app/privacy-policy.lazy').then((d) => d.Route),
)

const AppHandleIndexRoute = AppHandleIndexImport.update({
  path: '/$handle/',
  getParentRoute: () => AppRoute,
} as any)

const AppAlbumAlbumIdIndexRoute = AppAlbumAlbumIdIndexImport.update({
  path: '/album/$albumId/',
  getParentRoute: () => AppRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/onboard': {
      preLoaderRoute: typeof OnboardImport
      parentRoute: typeof rootRoute
    }
    '/_app/privacy-policy': {
      preLoaderRoute: typeof AppPrivacyPolicyLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/roadmap': {
      preLoaderRoute: typeof AppRoadmapLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/terms': {
      preLoaderRoute: typeof AppTermsLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/': {
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/$handle/': {
      preLoaderRoute: typeof AppHandleIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/album/$albumId/': {
      preLoaderRoute: typeof AppAlbumAlbumIdIndexImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AppRoute.addChildren([
    AppPrivacyPolicyLazyRoute,
    AppRoadmapLazyRoute,
    AppTermsLazyRoute,
    AppIndexRoute,
    AppHandleIndexRoute,
    AppAlbumAlbumIdIndexRoute,
  ]),
  OnboardRoute,
])

/* prettier-ignore-end */
