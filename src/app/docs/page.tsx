'use client'

import 'swagger-ui-react/swagger-ui.css'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'

import { LoadingPage } from '@/shared/components/custom/loading-page'

export default function SwaggerPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => setSpec(data))
  }, [])

  if (!spec) {
    return <LoadingPage />
  }

  return <SwaggerUI spec={spec} />
}
