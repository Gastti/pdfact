// Verifica que el entorno de testing esté configurado correctamente.
// Este archivo se puede borrar cuando haya tests reales.
import { describe, it, expect } from 'vitest'

describe('setup', () => {
	it('vitest está configurado', () => {
		expect(true).toBe(true)
	})
})
