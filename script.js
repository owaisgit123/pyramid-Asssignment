// Main JavaScript file for Advanced Star Pattern Animations with Layout Patterns
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const canvas = document.getElementById("animation-canvas")
  const ctx = canvas.getContext("2d")
  const textOutput = document.getElementById("text-output")
  const patternSelect = document.getElementById("pattern-select")
  const layoutSelect = document.getElementById("layout-select")
  const starPatternSelect = document.getElementById("star-pattern-select")
  const playPauseBtn = document.getElementById("play-pause")
  const resetBtn = document.getElementById("reset")
  const randomizeBtn = document.getElementById("randomize")
  const speedSlider = document.getElementById("speed-slider")
  const speedValue = document.getElementById("speed-value")
  const densitySlider = document.getElementById("density-slider")
  const densityValue = document.getElementById("density-value")
  const sizeSlider = document.getElementById("size-slider")
  const sizeValue = document.getElementById("size-value")

  // Animation state
  let isPlaying = true
  let animationId = null
  let startTime = Date.now()
  let animationSpeed = 50
  let currentPattern = "morphing"
  let currentLayout = "grid"
  let currentStarPattern = "rightTriangle"
  let density = 100
  let patternSize = 8

  // Set canvas dimensions
  function resizeCanvas() {
    const container = canvas.parentElement
    canvas.width = container.clientWidth
    canvas.height = Math.min(window.innerHeight * 0.6, container.clientWidth * 0.75)
  }

  // Initialize
  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  // Event listeners
  patternSelect.addEventListener("change", function () {
    currentPattern = this.value
    resetAnimation()
  })

  layoutSelect.addEventListener("change", function () {
    currentLayout = this.value
    resetAnimation()
    updateActiveLayout()
  })

  starPatternSelect.addEventListener("change", function () {
    currentStarPattern = this.value
    resetAnimation()
    updateActivePattern()
  })

  playPauseBtn.addEventListener("click", function () {
    isPlaying = !isPlaying
    this.textContent = isPlaying ? "Pause" : "Play"

    if (isPlaying) {
      startTime = Date.now() - (Date.now() - startTime || 0)
      animate()
    } else if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })

  resetBtn.addEventListener("click", resetAnimation)

  randomizeBtn.addEventListener("click", () => {
    // Randomize pattern, layout, and star pattern
    const patterns = Array.from(patternSelect.options).map((opt) => opt.value)
    const layouts = Array.from(layoutSelect.options).map((opt) => opt.value)
    const starPatterns = Array.from(starPatternSelect.options).map((opt) => opt.value)

    currentPattern = patterns[Math.floor(Math.random() * patterns.length)]
    currentLayout = layouts[Math.floor(Math.random() * layouts.length)]
    currentStarPattern = starPatterns[Math.floor(Math.random() * starPatterns.length)]

    patternSelect.value = currentPattern
    layoutSelect.value = currentLayout
    starPatternSelect.value = currentStarPattern

    resetAnimation()
    updateActiveLayout()
    updateActivePattern()
  })

  speedSlider.addEventListener("input", function () {
    animationSpeed = Number.parseInt(this.value)
    speedValue.textContent = `${animationSpeed}%`
  })

  densitySlider.addEventListener("input", function () {
    density = Number.parseInt(this.value)
    densityValue.textContent = `${density}%`
  })

  sizeSlider.addEventListener("input", function () {
    patternSize = Number.parseInt(this.value)
    sizeValue.textContent = patternSize.toString()
  })

  function resetAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    textOutput.textContent = ""

    startTime = Date.now()

    if (isPlaying) {
      animate()
    }
  }

  function updateActiveLayout() {
    document.querySelectorAll(".layout-example").forEach((el) => {
      el.classList.remove("active")
    })
    const activeLayout = document.querySelector(`[data-layout="${currentLayout}"]`)
    if (activeLayout) {
      activeLayout.classList.add("active")
    }
  }

  function updateActivePattern() {
    document.querySelectorAll(".pattern-example").forEach((el) => {
      el.classList.remove("active")
    })
    const activePattern = document.querySelector(`[data-pattern="${currentStarPattern}"]`)
    if (activePattern) {
      activePattern.classList.add("active")
    }
  }

  // Layout Pattern Generator
  class LayoutPatternGenerator {
    constructor() {
      this.layouts = {
        grid: this.generateGridLayout.bind(this),
        circular: this.generateCircularLayout.bind(this),
        hexagonal: this.generateHexagonalLayout.bind(this),
        fractal: this.generateFractalLayout.bind(this),
        mandala: this.generateMandalaLayout.bind(this),
        tessellation: this.generateTessellationLayout.bind(this),
        scatter: this.generateScatterLayout.bind(this),
        flowField: this.generateFlowFieldLayout.bind(this),
        fibonacci: this.generateFibonacciLayout.bind(this),
        voronoi: this.generateVoronoiLayout.bind(this),
        triangular: this.generateTriangularLayout.bind(this),
        pyramid: this.generatePyramidLayout.bind(this),
      }
    }

    generateLayout(layoutType, width, height, time = 0) {
      if (this.layouts[layoutType]) {
        return this.layouts[layoutType](width, height, time)
      }
      return this.generateGridLayout(width, height, time)
    }

    generateGridLayout(width, height, time) {
      const points = []
      const spacing = Math.max(20, 60 * (density / 100))
      const cols = Math.floor(width / spacing)
      const rows = Math.floor(height / spacing)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) * spacing + (width - cols * spacing) / 2
          const y = (row + 0.5) * spacing + (height - rows * spacing) / 2
          const wave = Math.sin(time * 0.001 + col * 0.5 + row * 0.5) * 10

          points.push({
            x: x + wave,
            y: y + wave,
            size: 3 + Math.sin(time * 0.002 + col + row) * 2,
            hue: (time * 0.1 + col * 20 + row * 20) % 360,
            alpha: 0.8,
          })
        }
      }
      return points
    }

    generateCircularLayout(width, height, time) {
      const points = []
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.min(width, height) / 2 - 20
      const rings = Math.floor(8 * (density / 100))

      for (let ring = 1; ring <= rings; ring++) {
        const radius = (ring / rings) * maxRadius
        const circumference = 2 * Math.PI * radius
        const pointsInRing = Math.max(6, Math.floor(circumference / 20))

        for (let i = 0; i < pointsInRing; i++) {
          const angle = (i / pointsInRing) * Math.PI * 2 + time * 0.001 * ring
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          points.push({
            x,
            y,
            size: 3 + Math.sin(time * 0.002 + ring) * 2,
            hue: (time * 0.1 + ring * 30 + i * 10) % 360,
            alpha: 0.8,
          })
        }
      }
      return points
    }

    generateHexagonalLayout(width, height, time) {
      const points = []
      const spacing = Math.max(25, 50 * (density / 100))
      const hexHeight = spacing * Math.sqrt(3)
      const cols = Math.floor(width / (spacing * 1.5))
      const rows = Math.floor(height / hexHeight)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing * 1.5 + (width - cols * spacing * 1.5) / 2
          const y = row * hexHeight + ((col % 2) * hexHeight) / 2 + (height - rows * hexHeight) / 2

          if (x >= 0 && x <= width && y >= 0 && y <= height) {
            const wave = Math.sin(time * 0.001 + col * 0.3 + row * 0.3) * 5

            points.push({
              x: x + wave,
              y: y + wave,
              size: 3 + Math.sin(time * 0.002 + col + row) * 2,
              hue: (time * 0.1 + col * 25 + row * 25) % 360,
              alpha: 0.8,
            })
          }
        }
      }
      return points
    }

    generateFractalLayout(width, height, time) {
      const points = []
      const centerX = width / 2
      const centerY = height / 2
      const maxDepth = Math.floor(4 * (density / 100))

      const addFractalPoints = (x, y, size, depth) => {
        if (depth <= 0 || size < 2) return

        points.push({
          x,
          y,
          size: size * 0.5,
          hue: (time * 0.1 + depth * 60) % 360,
          alpha: 0.6 + depth * 0.1,
        })

        const branches = 5
        for (let i = 0; i < branches; i++) {
          const angle = (i / branches) * Math.PI * 2 + time * 0.001
          const newX = x + Math.cos(angle) * size * 2
          const newY = y + Math.sin(angle) * size * 2

          if (newX >= 0 && newX <= width && newY >= 0 && newY <= height) {
            addFractalPoints(newX, newY, size * 0.6, depth - 1)
          }
        }
      }

      addFractalPoints(centerX, centerY, 30, maxDepth)
      return points
    }

    generateMandalaLayout(width, height, time) {
      const points = []
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.min(width, height) / 2 - 20
      const layers = Math.floor(6 * (density / 100))

      for (let layer = 1; layer <= layers; layer++) {
        const radius = (layer / layers) * maxRadius
        const petals = layer * 8

        for (let petal = 0; petal < petals; petal++) {
          const angle = (petal / petals) * Math.PI * 2 + time * 0.001 * layer

          // Main petal points
          for (let r = 0; r <= radius; r += 15) {
            const petalRadius = r * Math.sin((r / radius) * Math.PI)
            const x = centerX + Math.cos(angle) * petalRadius
            const y = centerY + Math.sin(angle) * petalRadius

            points.push({
              x,
              y,
              size: 2 + Math.sin(time * 0.002 + layer + petal) * 1.5,
              hue: (time * 0.1 + layer * 45 + petal * 5) % 360,
              alpha: 0.7,
            })
          }
        }
      }
      return points
    }

    generateTessellationLayout(width, height, time) {
      const points = []
      const tileSize = Math.max(30, 60 * (density / 100))
      const cols = Math.floor(width / tileSize)
      const rows = Math.floor(height / tileSize)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * tileSize + tileSize / 2
          const baseY = row * tileSize + tileSize / 2

          // Create tessellation pattern (triangular)
          const patterns = [
            { x: 0, y: -tileSize / 3 },
            { x: -tileSize / 3, y: tileSize / 6 },
            { x: tileSize / 3, y: tileSize / 6 },
          ]

          patterns.forEach((pattern, i) => {
            const rotation = time * 0.001 + col * 0.1 + row * 0.1
            const x = baseX + pattern.x * Math.cos(rotation) - pattern.y * Math.sin(rotation)
            const y = baseY + pattern.x * Math.sin(rotation) + pattern.y * Math.cos(rotation)

            points.push({
              x,
              y,
              size: 3 + Math.sin(time * 0.002 + i) * 1,
              hue: (time * 0.1 + col * 30 + row * 30 + i * 120) % 360,
              alpha: 0.8,
            })
          })
        }
      }
      return points
    }

    generateScatterLayout(width, height, time) {
      const points = []
      const numPoints = Math.floor(200 * (density / 100))

      // Use seeded random for consistent but animated scatter
      for (let i = 0; i < numPoints; i++) {
        const seed = i * 12345
        const x = (((seed * 9301 + 49297) % 233280) / 233280) * width
        const y = (((seed * 9301 + 49297 + 1000) % 233280) / 233280) * height

        // Add some movement
        const moveX = Math.sin(time * 0.001 + i * 0.1) * 20
        const moveY = Math.cos(time * 0.001 + i * 0.1) * 20

        points.push({
          x: x + moveX,
          y: y + moveY,
          size: 2 + Math.sin(time * 0.002 + i) * 2,
          hue: (time * 0.1 + i * 10) % 360,
          alpha: 0.6 + Math.sin(time * 0.001 + i) * 0.3,
        })
      }
      return points
    }

    generateFlowFieldLayout(width, height, time) {
      const points = []
      const spacing = Math.max(15, 30 * (density / 100))
      const cols = Math.floor(width / spacing)
      const rows = Math.floor(height / spacing)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing
          const y = row * spacing

          // Create flow field using noise-like function
          const angle = Math.sin(x * 0.01 + time * 0.001) * Math.cos(y * 0.01 + time * 0.001) * Math.PI * 2
          const flowX = x + Math.cos(angle) * 20
          const flowY = y + Math.sin(angle) * 20

          points.push({
            x: flowX,
            y: flowY,
            size: 2 + Math.sin(time * 0.002 + col + row) * 1.5,
            hue: ((angle * 180) / Math.PI + time * 0.1) % 360,
            alpha: 0.7,
          })
        }
      }
      return points
    }

    generateFibonacciLayout(width, height, time) {
      const points = []
      const centerX = width / 2
      const centerY = height / 2
      const maxPoints = Math.floor(300 * (density / 100))
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle in radians

      for (let i = 0; i < maxPoints; i++) {
        const angle = i * goldenAngle + time * 0.001
        const radius = Math.sqrt(i) * 8

        if (radius > Math.min(width, height) / 2) break

        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        points.push({
          x,
          y,
          size: 2 + Math.sin(time * 0.002 + i * 0.1) * 2,
          hue: (i * 5 + time * 0.1) % 360,
          alpha: 0.8,
        })
      }
      return points
    }

    generateVoronoiLayout(width, height, time) {
      const points = []
      const seeds = []
      const numSeeds = Math.floor(20 * (density / 100))

      // Generate seed points
      for (let i = 0; i < numSeeds; i++) {
        const seed = i * 12345
        seeds.push({
          x: (((seed * 9301 + 49297) % 233280) / 233280) * width,
          y: (((seed * 9301 + 49297 + 1000) % 233280) / 233280) * height,
          hue: ((i * 360) / numSeeds + time * 0.1) % 360,
        })
      }

      // Generate points based on Voronoi cells
      const spacing = 20
      const cols = Math.floor(width / spacing)
      const rows = Math.floor(height / spacing)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing
          const y = row * spacing

          // Find closest seed
          let closestSeed = seeds[0]
          let minDistance = Number.POSITIVE_INFINITY

          seeds.forEach((seed) => {
            const distance = Math.sqrt((x - seed.x) ** 2 + (y - seed.y) ** 2)
            if (distance < minDistance) {
              minDistance = distance
              closestSeed = seed
            }
          })

          // Add some animation to the cell points
          const cellX = x + Math.sin(time * 0.001 + col * 0.1) * 5
          const cellY = y + Math.cos(time * 0.001 + row * 0.1) * 5

          points.push({
            x: cellX,
            y: cellY,
            size: 2 + Math.sin(time * 0.002 + minDistance * 0.01) * 1,
            hue: closestSeed.hue,
            alpha: 0.6 + Math.sin(time * 0.001 + minDistance * 0.01) * 0.3,
          })
        }
      }
      return points
    }

    generateTriangularLayout(width, height, time) {
      const points = []
      const spacing = Math.max(25, 50 * (density / 100))
      const triangleHeight = (spacing * Math.sqrt(3)) / 2
      const cols = Math.floor(width / spacing)
      const rows = Math.floor(height / triangleHeight)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + ((row % 2) * spacing) / 2 + (width - cols * spacing) / 2
          const y = row * triangleHeight + (height - rows * triangleHeight) / 2

          if (x >= 0 && x <= width && y >= 0 && y <= height) {
            const wave = Math.sin(time * 0.001 + col * 0.4 + row * 0.4) * 8

            points.push({
              x: x + wave,
              y: y + wave,
              size: 3 + Math.sin(time * 0.002 + col + row) * 2,
              hue: (time * 0.1 + col * 30 + row * 30) % 360,
              alpha: 0.8,
            })
          }
        }
      }
      return points
    }

    generatePyramidLayout(width, height, time) {
      const points = []
      const centerX = width / 2
      const maxRows = Math.floor(12 * (density / 100))
      const spacing = Math.min(width, height) / (maxRows * 2)

      for (let row = 0; row < maxRows; row++) {
        const pointsInRow = row + 1
        const rowWidth = pointsInRow * spacing
        const startX = centerX - rowWidth / 2

        for (let col = 0; col < pointsInRow; col++) {
          const x = startX + col * spacing + spacing / 2
          const y = height - (row + 1) * spacing + (height - maxRows * spacing) / 2

          const wave = Math.sin(time * 0.001 + col * 0.3 + row * 0.3) * 10

          points.push({
            x: x + wave,
            y: y + wave,
            size: 3 + Math.sin(time * 0.002 + col + row) * 2,
            hue: (time * 0.1 + row * 40 + col * 20) % 360,
            alpha: 0.8,
          })
        }
      }
      return points
    }
  }

  // Advanced Star Pattern Animator (updated to use layouts)
  class StarPatternAnimator {
    constructor() {
      this.layoutGenerator = new LayoutPatternGenerator()
      this.matrixDrops = null
      this.particles = null
      this.lastExplosion = 0
      this.initializePatterns()
    }

    initializePatterns() {
      this.patterns = {
        // 1. Morphing Patterns Animation with Layout
        morphing: (time) => {
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)
          const cycle = (time / 3000) % 4
          const t = (time / 3000) % 1
          const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

          points.forEach((point, index) => {
            const shouldDraw = this.getMorphingCondition(point, index, cycle, easeInOut, time)

            if (shouldDraw) {
              ctx.fillStyle = `hsla(${point.hue}, 70%, 60%, ${point.alpha})`
              ctx.beginPath()
              ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
              ctx.fill()
            }
          })
        },

        // 2. 3D Rotating Pyramid with Layout
        pyramid3d: (time) => {
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)
          const rotationY = time / 1000
          const rotationX = Math.sin(time / 2000) * 0.3

          points.forEach((point) => {
            // Apply 3D transformation
            const x3d = point.x - canvas.width / 2
            const y3d = point.y - canvas.height / 2
            const z3d = Math.sin(time * 0.001 + point.x * 0.01) * 50

            // Rotate around Y axis
            const rotatedX = x3d * Math.cos(rotationY) - z3d * Math.sin(rotationY)
            const rotatedZ = x3d * Math.sin(rotationY) + z3d * Math.cos(rotationY)

            // Rotate around X axis
            const finalY = y3d * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX)
            const finalZ = y3d * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX)

            // Project to 2D
            const perspective = 500
            const scale = perspective / (perspective + finalZ)
            const x2d = canvas.width / 2 + rotatedX * scale
            const y2d = canvas.height / 2 + finalY * scale

            const brightness = Math.max(0.3, (finalZ + 200) / 400)

            ctx.fillStyle = `hsla(${point.hue}, 70%, ${brightness * 60}%, ${point.alpha * brightness})`
            ctx.beginPath()
            ctx.arc(x2d, y2d, point.size * scale, 0, Math.PI * 2)
            ctx.fill()
          })
        },

        // 3. Wave Interference Pattern with Layout
        waves: (time) => {
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)

          points.forEach((point) => {
            // Multiple wave sources
            const wave1 =
              Math.sin((point.x - canvas.width * 0.3) * 0.02 + time * 0.005) *
              Math.sin((point.y - canvas.height * 0.3) * 0.02 + time * 0.005)
            const wave2 =
              Math.sin((point.x - canvas.width * 0.7) * 0.02 + time * 0.003) *
              Math.sin((point.y - canvas.height * 0.7) * 0.02 + time * 0.003)
            const wave3 = Math.sin(
              Math.sqrt((point.x - canvas.width / 2) ** 2 + (point.y - canvas.height / 2) ** 2) * 0.02 - time * 0.01,
            )

            const amplitude = (wave1 + wave2 + wave3) / 3

            if (Math.abs(amplitude) > 0.3) {
              const size = Math.abs(amplitude) * point.size * 3
              const hue = (amplitude * 180 + point.hue + time / 10) % 360
              const brightness = Math.abs(amplitude) * 70 + 30

              ctx.fillStyle = `hsla(${hue}, 80%, ${brightness}%, ${point.alpha})`
              ctx.beginPath()
              ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
              ctx.fill()
            }
          })
        },

        // 4. Matrix Digital Rain with Layout
        matrix: (time) => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const chars = "★✦✧✩✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋"
          const fontSize = 20

          if (!this.matrixDrops) {
            const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)
            this.matrixDrops = points.map((point) => ({
              x: point.x,
              y: Math.random() * canvas.height,
              speed: Math.random() * 3 + 1,
              char: chars[Math.floor(Math.random() * chars.length)],
            }))
          }

          ctx.font = `${fontSize}px monospace`

          this.matrixDrops.forEach((drop) => {
            const gradient = ctx.createLinearGradient(drop.x, drop.y - 100, drop.x, drop.y)
            gradient.addColorStop(0, "rgba(0, 255, 0, 0)")
            gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.8)")
            gradient.addColorStop(1, "rgba(0, 255, 0, 1)")

            ctx.fillStyle = gradient
            ctx.fillText(drop.char, drop.x, drop.y)

            drop.y += drop.speed * fontSize
            if (drop.y > canvas.height && Math.random() > 0.975) {
              drop.y = 0
              drop.char = chars[Math.floor(Math.random() * chars.length)]
            }
          })
        },

        // 5. Particle Explosion with Layout
        explosion: (time) => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          if (!this.particles) {
            this.particles = []
            this.lastExplosion = 0
          }

          // Create new explosion every 3 seconds at layout points
          if (time - this.lastExplosion > 3000) {
            const layoutPoints = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)
            const explosionPoint = layoutPoints[Math.floor(Math.random() * layoutPoints.length)]

            if (explosionPoint) {
              for (let i = 0; i < 50; i++) {
                const angle = (Math.PI * 2 * i) / 50
                const speed = Math.random() * 5 + 2
                this.particles.push({
                  x: explosionPoint.x,
                  y: explosionPoint.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  life: 1,
                  decay: Math.random() * 0.02 + 0.01,
                  hue: explosionPoint.hue,
                  size: Math.random() * 4 + 2,
                })
              }
            }
            this.lastExplosion = time
          }

          // Update and draw particles
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i]

            p.x += p.vx
            p.y += p.vy
            p.vy += 0.1 // gravity
            p.life -= p.decay

            if (p.life <= 0) {
              this.particles.splice(i, 1)
              continue
            }

            ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
            ctx.fill()
          }
        },

        // 6. Spiral Galaxy with Layout
        spiral: (time) => {
          ctx.fillStyle = "rgba(0, 0, 20, 0.1)"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2

          points.forEach((point) => {
            // Convert to spiral coordinates
            const dx = point.x - centerX
            const dy = point.y - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const angle = Math.atan2(dy, dx) + time * 0.001 + distance * 0.01

            const spiralX = centerX + Math.cos(angle) * distance
            const spiralY = centerY + Math.sin(angle) * distance

            const brightness = Math.max(0.2, 1 - distance / (Math.min(canvas.width, canvas.height) / 2))

            ctx.fillStyle = `hsla(${point.hue}, 70%, ${brightness * 60 + 20}%, ${point.alpha * brightness})`
            ctx.beginPath()
            ctx.arc(spiralX, spiralY, point.size * brightness, 0, Math.PI * 2)
            ctx.fill()
          })
        },

        // 7. Triangle Patterns Animation
        trianglePatterns: (time) => {
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const points = this.layoutGenerator.generateLayout(currentLayout, canvas.width, canvas.height, time)

          points.forEach((point, index) => {
            const shouldDraw = this.getTrianglePatternCondition(point, index, time)

            if (shouldDraw) {
              ctx.fillStyle = `hsla(${point.hue}, 70%, 60%, ${point.alpha})`
              ctx.beginPath()
              ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
              ctx.fill()
            }
          })
        },
      }
    }

    getMorphingCondition(point, index, cycle, easeInOut, time) {
      const gridSize = 8
      const row = Math.floor(index / gridSize)
      const col = index % gridSize

      if (Math.floor(cycle) === 0) {
        // Triangle to Square
        const triangleCondition = col <= row
        const squareCondition = row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1
        return (triangleCondition && 1 - easeInOut) || (squareCondition && easeInOut > 0.5)
      } else if (Math.floor(cycle) === 1) {
        // Square to Diamond
        const squareCondition = row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1
        const diamondCondition = Math.abs(row - gridSize / 2) + Math.abs(col - gridSize / 2) <= gridSize / 2
        return (squareCondition && 1 - easeInOut) || (diamondCondition && easeInOut > 0.5)
      } else if (Math.floor(cycle) === 2) {
        // Diamond to Circle
        const diamondCondition = Math.abs(row - gridSize / 2) + Math.abs(col - gridSize / 2) <= gridSize / 2
        const circleCondition =
          Math.sqrt(Math.pow(row - gridSize / 2, 2) + Math.pow(col - gridSize / 2, 2)) <= gridSize / 2
        return (diamondCondition && 1 - easeInOut) || (circleCondition && easeInOut > 0.5)
      } else {
        // Circle to Triangle
        const circleCondition =
          Math.sqrt(Math.pow(row - gridSize / 2, 2) + Math.pow(col - gridSize / 2, 2)) <= gridSize / 2
        const triangleCondition = col <= row
        return (circleCondition && 1 - easeInOut) || (triangleCondition && easeInOut > 0.5)
      }
    }

    getTrianglePatternCondition(point, index, time) {
      const cycle = Math.floor(time / 2000) % 4
      const t = (time / 2000) % 1

      // Create different triangle pattern conditions based on current star pattern
      switch (currentStarPattern) {
        case "rightTriangle":
          return index % 10 <= Math.floor(t * 10)
        case "leftTriangle":
          return index % 10 >= Math.floor((1 - t) * 10)
        case "reverseRightTriangle":
          return index % 10 >= Math.floor(t * 10)
        case "reverseLeftTriangle":
          return index % 10 <= Math.floor((1 - t) * 10)
        case "pyramid":
          const center = 5
          const distance = Math.abs((index % 10) - center)
          return distance <= Math.floor(t * 5)
        case "diamond":
          const centerDiamond = 5
          const distanceDiamond = Math.abs((index % 10) - centerDiamond)
          return cycle < 2 ? distanceDiamond <= Math.floor(t * 5) : distanceDiamond >= Math.floor(t * 5)
        default:
          return Math.sin(time * 0.01 + index * 0.1) > 0
      }
    }

    animate(patternName, time) {
      if (this.patterns[patternName]) {
        this.patterns[patternName](time)
      }
    }
  }

  // Text-based pattern animations
  const textPatterns = {
    textPattern: (time) => {
      const patterns = [
        generateRightTriangle,
        generateLeftTriangle,
        generatePyramid,
        generateDiamond,
        generateHollowSquare,
        generateReverseRightTriangle,
        generateReverseLeftTriangle,
        generateLeftHalfPyramid,
        generateRightHalfPyramid,
        generateHollowTriangle,
        generateDoubleTriangle,
        generateZigzagTriangle,
      ]

      const patternIndex = Math.floor(time / 5000) % patterns.length
      const size = patternSize

      const pattern = patterns[patternIndex](size)
      const cursorPos = Math.floor(time / 200) % pattern.length
      const patternWithCursor = pattern.substring(0, cursorPos) + "█" + pattern.substring(cursorPos + 1)

      textOutput.textContent = patternWithCursor

      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },

    trianglePatterns: (time) => {
      const pattern = getStarPattern(currentStarPattern, patternSize)
      const cursorPos = Math.floor(time / 150) % pattern.length
      const patternWithCursor = pattern.substring(0, cursorPos) + "█" + pattern.substring(cursorPos + 1)

      textOutput.textContent = patternWithCursor

      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },
  }

  // Pattern generation functions
  function generateRightTriangle(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= i; j++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateLeftTriangle(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += "  "
      }
      for (let k = 1; k <= i; k++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generatePyramid(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        pattern += "★"
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateDiamond(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        pattern += "★"
      }
      pattern += "\n"
    }
    for (let i = size - 1; i >= 1; i--) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        pattern += "★"
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateHollowSquare(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        if (i === 1 || i === size || j === 1 || j === size) {
          pattern += "★ "
        } else {
          pattern += "  "
        }
      }
      pattern += "\n"
    }
    return pattern
  }

  // New pattern functions
  function generateReverseRightTriangle(size) {
    let pattern = ""
    for (let i = size; i >= 1; i--) {
      for (let j = 1; j <= i; j++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateReverseLeftTriangle(size) {
    let pattern = ""
    for (let i = size; i >= 1; i--) {
      for (let j = 1; j <= size - i; j++) {
        pattern += "  "
      }
      for (let k = 1; k <= i; k++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateLeftHalfPyramid(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += "  "
      }
      for (let k = 1; k <= i; k++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateRightHalfPyramid(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= i; j++) {
        pattern += "★ "
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateHollowTriangle(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        if (k === 1 || k === 2 * i - 1 || i === size) {
          pattern += "★"
        } else {
          pattern += " "
        }
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateDoubleTriangle(size) {
    let pattern = ""
    // Upper triangle
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        pattern += "★"
      }
      pattern += "\n"
    }
    // Lower triangle (inverted)
    for (let i = size - 1; i >= 1; i--) {
      for (let j = 1; j <= size - i; j++) {
        pattern += " "
      }
      for (let k = 1; k <= 2 * i - 1; k++) {
        pattern += "★"
      }
      pattern += "\n"
    }
    return pattern
  }

  function generateZigzagTriangle(size) {
    let pattern = ""
    for (let i = 1; i <= size; i++) {
      if (i % 2 === 1) {
        // Left aligned
        for (let j = 1; j <= i; j++) {
          pattern += "★ "
        }
      } else {
        // Right aligned
        for (let j = 1; j <= size - i; j++) {
          pattern += "  "
        }
        for (let k = 1; k <= i; k++) {
          pattern += "★ "
        }
      }
      pattern += "\n"
    }
    return pattern
  }

  function getStarPattern(patternType, size) {
    switch (patternType) {
      case "rightTriangle":
        return generateRightTriangle(size)
      case "leftTriangle":
        return generateLeftTriangle(size)
      case "pyramid":
        return generatePyramid(size)
      case "diamond":
        return generateDiamond(size)
      case "hollowSquare":
        return generateHollowSquare(size)
      case "reverseRightTriangle":
        return generateReverseRightTriangle(size)
      case "reverseLeftTriangle":
        return generateReverseLeftTriangle(size)
      case "leftHalfPyramid":
        return generateLeftHalfPyramid(size)
      case "rightHalfPyramid":
        return generateRightHalfPyramid(size)
      case "hollowTriangle":
        return generateHollowTriangle(size)
      case "doubleTriangle":
        return generateDoubleTriangle(size)
      case "zigzagTriangle":
        return generateZigzagTriangle(size)
      default:
        return generateRightTriangle(size)
    }
  }

  // Initialize layout previews
  function initializeLayoutPreviews() {
    const layoutExamples = document.querySelectorAll(".layout-example")
    const layoutGen = new LayoutPatternGenerator()

    layoutExamples.forEach((example) => {
      const canvas = example.querySelector(".preview-canvas")
      const ctx = canvas.getContext("2d")
      const layoutType = example.dataset.layout

      function drawPreview() {
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const points = layoutGen.generateLayout(layoutType, canvas.width, canvas.height, Date.now())

        points.forEach((point) => {
          ctx.fillStyle = `hsla(${point.hue}, 70%, 60%, ${point.alpha})`
          ctx.beginPath()
          ctx.arc(point.x, point.y, Math.max(1, point.size * 0.5), 0, Math.PI * 2)
          ctx.fill()
        })

        requestAnimationFrame(drawPreview)
      }

      drawPreview()

      // Click to select layout
      example.addEventListener("click", () => {
        currentLayout = layoutType
        layoutSelect.value = layoutType
        resetAnimation()
        updateActiveLayout()
      })
    })
  }

  // Initialize pattern previews
  function initializePatternPreviews() {
    const patternExamples = document.querySelectorAll(".pattern-example")

    patternExamples.forEach((example) => {
      const patternType = example.dataset.pattern

      // Click to select pattern
      example.addEventListener("click", () => {
        currentStarPattern = patternType
        starPatternSelect.value = patternType
        resetAnimation()
        updateActivePattern()
      })
    })
  }

  // Animation loop
  const animator = new StarPatternAnimator()

  function animate() {
    if (!isPlaying) return

    const currentTime = Date.now() - startTime
    const adjustedTime = currentTime * (animationSpeed / 50)

    if (currentPattern === "textPattern" || currentPattern === "trianglePatterns") {
      textPatterns[currentPattern](adjustedTime)
      textOutput.style.display = "block"
    } else {
      animator.animate(currentPattern, adjustedTime)
      textOutput.style.display = "none"
    }

    animationId = requestAnimationFrame(animate)
  }

  // Initialize everything
  initializeLayoutPreviews()
  initializePatternPreviews()
  updateActiveLayout()
  updateActivePattern()
  animate()
})
