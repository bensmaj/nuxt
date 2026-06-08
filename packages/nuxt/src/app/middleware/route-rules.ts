import { hasProtocol, withQuery } from 'ufo'
import { defineNuxtRouteMiddleware } from '../composables/router'
import type { RouteMiddleware } from '../composables/router'
import { getRouteRules } from '../composables/manifest'

const middleware: RouteMiddleware = defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || import.meta.test) { return }
  const rules = getRouteRules({ path: to.path })
  if (rules.redirect) {
    // preserve the incoming query parameters, just as we preserve the hash below
    const redirect = Object.keys(to.query).length ? withQuery(rules.redirect, to.query) : rules.redirect
    const path = redirect.includes('#') ? redirect : (redirect + to.hash)
    if (hasProtocol(path, { acceptRelative: true })) {
      window.location.href = path
      return false
    }
    return path
  }
})

export default middleware
