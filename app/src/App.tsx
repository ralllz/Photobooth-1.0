import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import { 
  Camera, 
  Download, 
  Sparkles, 
  Heart, 
  Star, 
  Image as ImageIcon, 
  RefreshCw, 
  Check,
  Trash2,
  Palette,
  Music,
  Ghost,
  IceCream,
  RotateCw,
  Type,
  ChevronLeft,
  Edit3,
  Crop,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import gsap from 'gsap'
import { getTemplateImage } from '@/lib/templateImages'

// Types
interface Sticker {
  id: string
  src: string
  x: number
  y: number
  scale: number
  rotation: number
}

interface CapturedPhoto {
  id: string
  src: string
  x: number
  y: number
  scale: number
  rotation: number
  filter: string
}

interface TextItem {
  id: string
  text: string
  x: number
  y: number
  font: string
  size: number
  color: string
  rotation: number
}

interface Template {
  id: string
  name: string
  src: string
  photoSlots: { x: number; y: number; width: number; height: number }[]
  width: number
  height: number
}

// 18 Templates with varied photo counts
const templates: Template[] = [
  {
    id: 'strip4',
    name: '4-Strip',
    src: '/templates/strip4.png',
    photoSlots: [
      { x: 50, y: 120, width: 300, height: 200 },
      { x: 50, y: 340, width: 300, height: 200 },
      { x: 50, y: 560, width: 300, height: 200 },
      { x: 50, y: 780, width: 300, height: 200 }
    ],
    width: 400,
    height: 1000
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    src: '/templates/polaroid.png',
    photoSlots: [
      { x: 40, y: 40, width: 160, height: 160 },
      { x: 220, y: 40, width: 160, height: 160 },
      { x: 40, y: 240, width: 160, height: 160 },
      { x: 220, y: 240, width: 160, height: 160 }
    ],
    width: 420,
    height: 440
  },
  {
    id: 'filmstrip',
    name: 'Film',
    src: '/templates/filmstrip.png',
    photoSlots: [
      { x: 60, y: 80, width: 280, height: 200 },
      { x: 60, y: 320, width: 280, height: 200 },
      { x: 60, y: 560, width: 280, height: 200 }
    ],
    width: 400,
    height: 800
  },
  {
    id: 'scrapbook',
    name: 'Grid',
    src: '/templates/scrapbook.png',
    photoSlots: [
      { x: 30, y: 30, width: 170, height: 170 },
      { x: 220, y: 30, width: 170, height: 170 },
      { x: 30, y: 220, width: 170, height: 170 },
      { x: 220, y: 220, width: 170, height: 170 }
    ],
    width: 420,
    height: 420
  },
  {
    id: 'pastel',
    name: 'Pastel',
    src: '/templates/pastel.png',
    photoSlots: [{ x: 50, y: 60, width: 300, height: 400 }],
    width: 400,
    height: 520
  },
  {
    id: 'newspaper',
    name: 'News',
    src: '/templates/newspaper.png',
    photoSlots: [
      { x: 30, y: 180, width: 160, height: 120 },
      { x: 210, y: 180, width: 160, height: 120 },
      { x: 100, y: 380, width: 200, height: 150 }
    ],
    width: 400,
    height: 560
  },
  {
    id: 'love',
    name: 'Love',
    src: '/templates/love.png',
    photoSlots: [{ x: 60, y: 80, width: 280, height: 360 }],
    width: 400,
    height: 520
  },
  {
    id: 'birthday',
    name: 'Birthday',
    src: '/templates/birthday.png',
    photoSlots: [{ x: 60, y: 100, width: 280, height: 340 }],
    width: 400,
    height: 520
  },
  {
    id: 'sakura',
    name: 'Sakura',
    src: '/templates/sakura.png',
    photoSlots: [{ x: 50, y: 70, width: 300, height: 380 }],
    width: 400,
    height: 520
  },
  {
    id: 'unicorn',
    name: 'Unicorn',
    src: '/templates/unicorn.png',
    photoSlots: [{ x: 60, y: 90, width: 280, height: 340 }],
    width: 400,
    height: 520
  },
  {
    id: 'summer',
    name: 'Summer',
    src: '/templates/summer.png',
    photoSlots: [{ x: 50, y: 80, width: 300, height: 360 }],
    width: 400,
    height: 520
  },
  {
    id: 'catpaw',
    name: 'Cat Paw',
    src: '/templates/catpaw.png',
    photoSlots: [{ x: 60, y: 80, width: 280, height: 360 }],
    width: 400,
    height: 520
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    src: '/templates/galaxy.png',
    photoSlots: [{ x: 60, y: 90, width: 280, height: 340 }],
    width: 400,
    height: 520
  },
  // 5 NEW AESTHETIC TEMPLATES
  {
    id: 'scrap5',
    name: 'Scrap 5',
    src: '/templates/scrap5.png',
    photoSlots: [
      { x: 30, y: 40, width: 160, height: 160 },
      { x: 210, y: 40, width: 160, height: 160 },
      { x: 30, y: 220, width: 160, height: 160 },
      { x: 210, y: 220, width: 160, height: 160 },
      { x: 120, y: 400, width: 160, height: 160 }
    ],
    width: 420,
    height: 580
  },
  {
    id: 'dreamy3',
    name: 'Dreamy 3',
    src: '/templates/dreamy3.png',
    photoSlots: [
      { x: 40, y: 60, width: 320, height: 140 },
      { x: 40, y: 220, width: 320, height: 140 },
      { x: 40, y: 380, width: 320, height: 140 }
    ],
    width: 400,
    height: 540
  },
  {
    id: 'retro90s',
    name: 'Retro 90s',
    src: '/templates/retro90s.png',
    photoSlots: [
      { x: 40, y: 80, width: 150, height: 150 },
      { x: 210, y: 80, width: 150, height: 150 },
      { x: 40, y: 260, width: 150, height: 150 },
      { x: 210, y: 260, width: 150, height: 150 }
    ],
    width: 400,
    height: 440
  },
  {
    id: 'cottagecore',
    name: 'Cottage',
    src: '/templates/cottagecore.png',
    photoSlots: [
      { x: 50, y: 100, width: 300, height: 160 },
      { x: 30, y: 300, width: 160, height: 160 },
      { x: 210, y: 300, width: 160, height: 160 }
    ],
    width: 400,
    height: 480
  },
  {
    id: 'y2k',
    name: 'Y2K',
    src: '/templates/y2k.png',
    photoSlots: [
      { x: 30, y: 40, width: 150, height: 150 },
      { x: 220, y: 40, width: 150, height: 150 },
      { x: 30, y: 220, width: 150, height: 150 },
      { x: 125, y: 220, width: 150, height: 150 },
      { x: 220, y: 220, width: 150, height: 150 }
    ],
    width: 420,
    height: 400
  }
]

// 10 Font options
const fontOptions = [
  { name: 'Fredoka', value: 'Fredoka One, cursive' },
  { name: 'Quicksand', value: 'Quicksand, sans-serif' },
  { name: 'Pacifico', value: 'Pacifico, cursive' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
  { name: 'Lobster', value: 'Lobster, cursive' },
  { name: 'Caveat', value: 'Caveat, cursive' },
  { name: 'Satisfy', value: 'Satisfy, cursive' },
  { name: 'Great Vibes', value: 'Great Vibes, cursive' },
  { name: 'Sacramento', value: 'Sacramento, cursive' },
  { name: 'Allura', value: 'Allura, cursive' }
]

// 25 Stickers per category (scrollable)
const stickerCategories = {
  cute: {
    name: 'Cute',
    icon: Heart,
    stickers: [
      { id: 'heart', src: '/stickers/heart.png' },
      { id: 'star', src: '/stickers/star.png' },
      { id: 'butterfly', src: '/stickers/butterfly.png' },
      { id: 'flower', src: '/stickers/flower.png' },
      { id: 'cloud', src: '/stickers/cloud.png' },
      { id: 'bear', src: '/stickers/bear.png' },
      { id: 'moon', src: '/stickers/moon.png' },
      { id: 'wings', src: '/stickers/wings.png' },
      { id: 'rainbow', src: '/stickers/rainbow.png' },
      { id: 'sun', src: '/stickers/sun.png' },
      { id: 'rose', src: '/stickers/rose.png' },
      { id: 'tulip', src: '/stickers/tulip.png' },
      { id: 'daisy', src: '/stickers/daisy.png' },
      { id: 'cherry', src: '/stickers/cherry.png' },
      { id: 'apple', src: '/stickers/apple.png' },
      { id: 'orange', src: '/stickers/orange.png' },
      { id: 'watermelon', src: '/stickers/watermelon.png' },
      { id: 'banana', src: '/stickers/banana.png' },
      { id: 'grape', src: '/stickers/grape.png' },
      { id: 'peach', src: '/stickers/peach.png' },
      { id: 'pineapple', src: '/stickers/pineapple.png' },
      { id: 'mango', src: '/stickers/mango.png' },
      { id: 'kiwi', src: '/stickers/kiwi.png' },
      { id: 'lemon', src: '/stickers/lemon.png' },
      { id: 'pear', src: '/stickers/pear.png' }
    ]
  },
  sparkle: {
    name: 'Sparkle',
    icon: Sparkles,
    stickers: [
      { id: 'sparkle', src: '/stickers/sparkle.png' },
      { id: 'diamond', src: '/stickers/diamond.png' },
      { id: 'shootingstar', src: '/stickers/shootingstar.png' },
      { id: 'crown', src: '/stickers/crown.png' },
      { id: 'ring', src: '/stickers/ring.png' },
      { id: 'bow', src: '/stickers/bow.png' },
      { id: 'blueberry', src: '/stickers/blueberry.png' },
      { id: 'star', src: '/stickers/star.png' },
      { id: 'heart', src: '/stickers/heart.png' },
      { id: 'moon', src: '/stickers/moon.png' },
      { id: 'sun', src: '/stickers/sun.png' },
      { id: 'rainbow', src: '/stickers/rainbow.png' },
      { id: 'flower', src: '/stickers/flower.png' },
      { id: 'butterfly', src: '/stickers/butterfly.png' },
      { id: 'cloud', src: '/stickers/cloud.png' },
      { id: 'wings', src: '/stickers/wings.png' },
      { id: 'rose', src: '/stickers/rose.png' },
      { id: 'tulip', src: '/stickers/tulip.png' },
      { id: 'daisy', src: '/stickers/daisy.png' },
      { id: 'cherry', src: '/stickers/cherry.png' },
      { id: 'apple', src: '/stickers/apple.png' },
      { id: 'orange', src: '/stickers/orange.png' },
      { id: 'strawberry', src: '/stickers/strawberry.png' },
      { id: 'grape', src: '/stickers/grape.png' },
      { id: 'peach', src: '/stickers/peach.png' }
    ]
  },
  food: {
    name: 'Food',
    icon: IceCream,
    stickers: [
      { id: 'strawberry', src: '/stickers/strawberry.png' },
      { id: 'cupcake', src: '/stickers/cupcake.png' },
      { id: 'icecream', src: '/stickers/icecream.png' },
      { id: 'donut', src: '/stickers/donut.png' },
      { id: 'apple', src: '/stickers/apple.png' },
      { id: 'orange', src: '/stickers/orange.png' },
      { id: 'watermelon', src: '/stickers/watermelon.png' },
      { id: 'banana', src: '/stickers/banana.png' },
      { id: 'grape', src: '/stickers/grape.png' },
      { id: 'peach', src: '/stickers/peach.png' },
      { id: 'pineapple', src: '/stickers/pineapple.png' },
      { id: 'mango', src: '/stickers/mango.png' },
      { id: 'kiwi', src: '/stickers/kiwi.png' },
      { id: 'lemon', src: '/stickers/lemon.png' },
      { id: 'pear', src: '/stickers/pear.png' },
      { id: 'blueberry', src: '/stickers/blueberry.png' },
      { id: 'cherry', src: '/stickers/cherry.png' },
      { id: 'heart', src: '/stickers/heart.png' },
      { id: 'star', src: '/stickers/star.png' },
      { id: 'flower', src: '/stickers/flower.png' },
      { id: 'butterfly', src: '/stickers/butterfly.png' },
      { id: 'cloud', src: '/stickers/cloud.png' },
      { id: 'moon', src: '/stickers/moon.png' },
      { id: 'sun', src: '/stickers/sun.png' },
      { id: 'rainbow', src: '/stickers/rainbow.png' }
    ]
  },
  music: {
    name: 'Music',
    icon: Music,
    stickers: [
      { id: 'music', src: '/stickers/music.png' },
      { id: 'heart', src: '/stickers/heart.png' },
      { id: 'star', src: '/stickers/star.png' },
      { id: 'sparkle', src: '/stickers/sparkle.png' },
      { id: 'moon', src: '/stickers/moon.png' },
      { id: 'sun', src: '/stickers/sun.png' },
      { id: 'cloud', src: '/stickers/cloud.png' },
      { id: 'rainbow', src: '/stickers/rainbow.png' },
      { id: 'flower', src: '/stickers/flower.png' },
      { id: 'butterfly', src: '/stickers/butterfly.png' },
      { id: 'rose', src: '/stickers/rose.png' },
      { id: 'tulip', src: '/stickers/tulip.png' },
      { id: 'daisy', src: '/stickers/daisy.png' },
      { id: 'cherry', src: '/stickers/cherry.png' },
      { id: 'apple', src: '/stickers/apple.png' },
      { id: 'orange', src: '/stickers/orange.png' },
      { id: 'strawberry', src: '/stickers/strawberry.png' },
      { id: 'grape', src: '/stickers/grape.png' },
      { id: 'peach', src: '/stickers/peach.png' },
      { id: 'pineapple', src: '/stickers/pineapple.png' },
      { id: 'mango', src: '/stickers/mango.png' },
      { id: 'kiwi', src: '/stickers/kiwi.png' },
      { id: 'lemon', src: '/stickers/lemon.png' },
      { id: 'pear', src: '/stickers/pear.png' },
      { id: 'blueberry', src: '/stickers/blueberry.png' }
    ]
  },
  fun: {
    name: 'Fun',
    icon: Ghost,
    stickers: [
      { id: 'ghost', src: '/stickers/ghost.png' },
      { id: 'pumpkin', src: '/stickers/pumpkin.png' },
      { id: 'lipstick', src: '/stickers/lipstick.png' },
      { id: 'heart', src: '/stickers/heart.png' },
      { id: 'star', src: '/stickers/star.png' },
      { id: 'sparkle', src: '/stickers/sparkle.png' },
      { id: 'moon', src: '/stickers/moon.png' },
      { id: 'sun', src: '/stickers/sun.png' },
      { id: 'cloud', src: '/stickers/cloud.png' },
      { id: 'rainbow', src: '/stickers/rainbow.png' },
      { id: 'flower', src: '/stickers/flower.png' },
      { id: 'butterfly', src: '/stickers/butterfly.png' },
      { id: 'rose', src: '/stickers/rose.png' },
      { id: 'tulip', src: '/stickers/tulip.png' },
      { id: 'daisy', src: '/stickers/daisy.png' },
      { id: 'cherry', src: '/stickers/cherry.png' },
      { id: 'apple', src: '/stickers/apple.png' },
      { id: 'orange', src: '/stickers/orange.png' },
      { id: 'strawberry', src: '/stickers/strawberry.png' },
      { id: 'grape', src: '/stickers/grape.png' },
      { id: 'peach', src: '/stickers/peach.png' },
      { id: 'pineapple', src: '/stickers/pineapple.png' },
      { id: 'mango', src: '/stickers/mango.png' },
      { id: 'kiwi', src: '/stickers/kiwi.png' },
      { id: 'lemon', src: '/stickers/lemon.png' }
    ]
  }
}

// Enhanced Filters
const filters = [
  { id: 'none', name: 'Normal', css: 'none' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.4) contrast(1.1) brightness(0.95)' },
  { id: 'bw', name: 'B&W', css: 'grayscale(1)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.3) saturate(1.3) hue-rotate(-10deg)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(180deg) saturate(0.8)' },
  { id: 'dreamy', name: 'Dreamy', css: 'brightness(1.1) saturate(1.2) blur(0.5px)' },
  { id: 'contrast', name: 'High Contrast', css: 'contrast(1.4) saturate(1.2)' },
  { id: 'soft', name: 'Soft', css: 'brightness(1.05) saturate(0.9) contrast(0.95)' },
  { id: 'fisheye', name: 'Fisheye', css: 'none' },
  { id: 'pixelate', name: 'Pixel', css: 'none' },
  { id: 'mirror', name: 'Mirror', css: 'none' },
  { id: 'cartoon', name: 'Cartoon', css: 'contrast(1.5) saturate(1.5)' },
  { id: 'vhs', name: 'VHS', css: 'saturate(1.3) hue-rotate(-5deg) contrast(1.1)' },
  { id: 'retro', name: 'Retro', css: 'sepia(0.6) contrast(1.2) brightness(0.9)' }
]

type Screen = 'home' | 'templates' | 'camera' | 'edit' | 'preview'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([])
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [texts, setTexts] = useState<TextItem[]>([])
  const [currentFilter, setCurrentFilter] = useState('none')
  const [countdown, setCountdown] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [flash, setFlash] = useState(false)
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)
  const [draggedText, setDraggedText] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cameraReady, setCameraReady] = useState(false)
  const [photoCount, setPhotoCount] = useState(4)
  const [customPhotoCount, setCustomPhotoCount] = useState('')
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [newText, setNewText] = useState('')
  const [selectedFont, setSelectedFont] = useState(fontOptions[0].value)
  const [textColor, setTextColor] = useState('#5D4E6D')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const editCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraReady(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      alert('Could not access camera. Please allow camera permissions.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraReady(false)
  }, [])

  // Apply filter to canvas context
  const applyFilterToContext = (ctx: CanvasRenderingContext2D, filterId: string, width: number, height: number) => {
    if (filterId === 'fisheye') {
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2
      
      const newImageData = ctx.createImageData(width, height)
      const newData = newImageData.data
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX
          const dy = y - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < radius) {
            const factor = Math.pow(dist / radius, 2) * 0.5 + 0.5
            const srcX = Math.round(centerX + dx * factor)
            const srcY = Math.round(centerY + dy * factor)
            
            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
              const srcIdx = (srcY * width + srcX) * 4
              const dstIdx = (y * width + x) * 4
              newData[dstIdx] = data[srcIdx]
              newData[dstIdx + 1] = data[srcIdx + 1]
              newData[dstIdx + 2] = data[srcIdx + 2]
              newData[dstIdx + 3] = data[srcIdx + 3]
            }
          } else {
            const idx = (y * width + x) * 4
            newData[idx] = data[idx]
            newData[idx + 1] = data[idx + 1]
            newData[idx + 2] = data[idx + 2]
            newData[idx + 3] = data[idx + 3]
          }
        }
      }
      ctx.putImageData(newImageData, 0, 0)
    } else if (filterId === 'pixelate') {
      const pixelSize = 8
      ctx.imageSmoothingEnabled = false
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = width / pixelSize
      tempCanvas.height = height / pixelSize
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.drawImage(ctx.canvas, 0, 0, tempCanvas.width, tempCanvas.height)
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(tempCanvas, 0, 0, width, height)
      ctx.imageSmoothingEnabled = true
    } else if (filterId === 'mirror') {
      ctx.save()
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(ctx.canvas, 0, 0)
      ctx.restore()
    }
  }

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    
    if (currentFilter === 'fisheye' || currentFilter === 'pixelate' || currentFilter === 'mirror') {
      applyFilterToContext(ctx, currentFilter, canvas.width, canvas.height)
    }
    
    const photoData = canvas.toDataURL('image/png')
    
    setCapturedPhotos(prev => [...prev, {
      id: `photo-${Date.now()}`,
      src: photoData,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      filter: currentFilter
    }])
    
    setFlash(true)
    setTimeout(() => setFlash(false), 150)
    
    return photoData
  }, [currentFilter])

  // Start capture sequence
  const startCapture = useCallback(async () => {
    setIsCapturing(true)
    setCapturedPhotos([])
    
    for (let i = 0; i < photoCount; i++) {
      for (let j = 3; j > 0; j--) {
        setCountdown(j)
        await new Promise(r => setTimeout(r, 1000))
      }
      setCountdown(0)
      capturePhoto()
      
      if (i < photoCount - 1) {
        await new Promise(r => setTimeout(r, 500))
      }
    }
    
    setIsCapturing(false)
    stopCamera()
    setCurrentScreen('edit')
  }, [photoCount, capturePhoto, stopCamera])

  // Add sticker
  const addSticker = useCallback((stickerSrc: string) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      src: stickerSrc,
      x: selectedTemplate.width / 2 - 40,
      y: selectedTemplate.height / 2 - 40,
      scale: 1,
      rotation: 0
    }
    setStickers(prev => [...prev, newSticker])
    setSelectedStickerId(newSticker.id)
  }, [selectedTemplate])

  // Add text
  const addText = useCallback(() => {
    if (!newText.trim()) return
    
    const newTextItem: TextItem = {
      id: `text-${Date.now()}`,
      text: newText,
      x: selectedTemplate.width / 2 - 50,
      y: selectedTemplate.height / 2,
      font: selectedFont,
      size: 24,
      color: textColor,
      rotation: 0
    }
    setTexts(prev => [...prev, newTextItem])
    setSelectedTextId(newTextItem.id)
    setNewText('')
  }, [newText, selectedFont, textColor, selectedTemplate])

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'photo' | 'sticker' | 'text', id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (type === 'photo') {
      setDraggedPhoto(id)
      setSelectedPhotoId(id)
      setSelectedStickerId(null)
      setSelectedTextId(null)
    } else if (type === 'sticker') {
      setDraggedSticker(id)
      setSelectedStickerId(id)
      setSelectedPhotoId(null)
      setSelectedTextId(null)
    } else {
      setDraggedText(id)
      setSelectedTextId(id)
      setSelectedPhotoId(null)
      setSelectedStickerId(null)
    }
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    if (draggedPhoto) {
      setCapturedPhotos(prev => prev.map(photo => {
        if (photo.id === draggedPhoto) {
          return { ...photo, x: photo.x + deltaX, y: photo.y + deltaY }
        }
        return photo
      }))
    } else if (draggedSticker) {
      setStickers(prev => prev.map(sticker => {
        if (sticker.id === draggedSticker) {
          return { ...sticker, x: sticker.x + deltaX, y: sticker.y + deltaY }
        }
        return sticker
      }))
    } else if (draggedText) {
      setTexts(prev => prev.map(text => {
        if (text.id === draggedText) {
          return { ...text, x: text.x + deltaX, y: text.y + deltaY }
        }
        return text
      }))
    }
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, draggedPhoto, draggedSticker, draggedText, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedPhoto(null)
    setDraggedSticker(null)
    setDraggedText(null)
  }, [])

  // Update photo
  const updatePhoto = useCallback((photoId: string, updates: Partial<CapturedPhoto>) => {
    setCapturedPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, ...updates } : photo
    ))
  }, [])

  // Update sticker
  const updateSticker = useCallback((stickerId: string, updates: Partial<Sticker>) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === stickerId ? { ...sticker, ...updates } : sticker
    ))
  }, [])

  // Update text
  const updateText = useCallback((textId: string, updates: Partial<TextItem>) => {
    setTexts(prev => prev.map(text => 
      text.id === textId ? { ...text, ...updates } : text
    ))
  }, [])

  // Delete sticker
  const deleteSticker = useCallback((stickerId: string) => {
    setStickers(prev => prev.filter(s => s.id !== stickerId))
    setSelectedStickerId(null)
  }, [])

  // Delete text
  const deleteText = useCallback((textId: string) => {
    setTexts(prev => prev.filter(t => t.id !== textId))
    setSelectedTextId(null)
  }, [])

  // Render canvas - used for both edit and preview
  const renderCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = selectedTemplate.width
    canvas.height = selectedTemplate.height
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background
    ctx.fillStyle = '#FFF0F5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw photos in slots
    capturedPhotos.forEach((photo, index) => {
      if (index >= selectedTemplate.photoSlots.length) return
      
      const slot = selectedTemplate.photoSlots[index]
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.save()
        
        // Create clipping path for slot
        ctx.beginPath()
        ctx.rect(slot.x, slot.y, slot.width, slot.height)
        ctx.clip()
        
        // Calculate dimensions
        const imgAspect = img.width / img.height
        const slotAspect = slot.width / slot.height
        
        let drawWidth, drawHeight, drawX, drawY
        
        if (imgAspect > slotAspect) {
          drawHeight = slot.height * photo.scale
          drawWidth = drawHeight * imgAspect
          drawY = slot.y + (slot.height - drawHeight) / 2 + photo.y
          drawX = slot.x + (slot.width - drawWidth) / 2 + photo.x
        } else {
          drawWidth = slot.width * photo.scale
          drawHeight = drawWidth / imgAspect
          drawX = slot.x + (slot.width - drawWidth) / 2 + photo.x
          drawY = slot.y + (slot.height - drawHeight) / 2 + photo.y
        }
        
        // Apply filter
        const filter = filters.find(f => f.id === photo.filter)
        if (filter && filter.id !== 'fisheye' && filter.id !== 'pixelate' && filter.id !== 'mirror') {
          ctx.filter = filter.css
        }
        
        // Apply rotation around center of photo
        ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2)
        ctx.rotate((photo.rotation * Math.PI) / 180)
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
        
        ctx.restore()
      }
      img.src = photo.src
    })
    
    // Draw texts
    texts.forEach(text => {
      ctx.save()
      ctx.translate(text.x, text.y)
      ctx.rotate((text.rotation * Math.PI) / 180)
      ctx.font = `${text.size}px ${text.font}`
      ctx.fillStyle = text.color
      ctx.textAlign = 'center'
      ctx.fillText(text.text, 0, 0)
      ctx.restore()
    })
    
    // Draw stickers (ON TOP of photos, BELOW template)
    stickers.forEach(sticker => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.save()
        ctx.translate(sticker.x + 40, sticker.y + 40)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.scale(sticker.scale, sticker.scale)
        ctx.drawImage(img, -40, -40, 80, 80)
        ctx.restore()
      }
      img.src = sticker.src
    })
    
    // Draw template overlay (ON TOP of everything)
    const templateImg = new Image()
    templateImg.crossOrigin = 'anonymous'
    templateImg.onload = () => {
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height)
    }
    templateImg.src = getTemplateImage(selectedTemplate.src.split('/').pop() || '')
    
  }, [capturedPhotos, stickers, texts, selectedTemplate])

  // Update canvas when changes occur
  useEffect(() => {
    if ((currentScreen === 'edit' || currentScreen === 'preview') && editCanvasRef.current) {
      renderCanvas(editCanvasRef.current)
    }
  }, [currentScreen, capturedPhotos, stickers, texts, selectedTemplate, renderCanvas])

  // Download final image
  const downloadImage = useCallback(async () => {
    if (!editCanvasRef.current) return
    
    // Re-render to ensure everything is drawn
    renderCanvas(editCanvasRef.current)
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const canvas = editCanvasRef.current
    const link = document.createElement('a')
    link.download = `photobooth-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [renderCanvas])

  // GSAP animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [currentScreen])

  // Screen transitions
  const goToTemplates = () => setCurrentScreen('templates')
  
  const goToCamera = (template: Template) => {
    setSelectedTemplate(template)
    setCapturedPhotos([])
    setStickers([])
    setTexts([])
    setSelectedPhotoId(null)
    setSelectedStickerId(null)
    setSelectedTextId(null)
    setCurrentScreen('camera')
    initCamera()
  }

  const goToHome = () => {
    stopCamera()
    setCurrentScreen('home')
    setCapturedPhotos([])
    setStickers([])
    setTexts([])
    setSelectedPhotoId(null)
    setSelectedStickerId(null)
    setSelectedTextId(null)
  }

  const goToEdit = () => {
    setCurrentScreen('edit')
  }

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-slow"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <Star className="w-4 h-4 text-yellow-300 opacity-60" />
            </div>
          ))}
        </div>
        
        <div ref={containerRef} className="text-center relative z-10">
          {/* Floating 3D Booth */}
          <div className="relative mb-8">
            <div className="animate-float">
              <div className="w-64 h-80 mx-auto bg-gradient-to-br from-pink-300 via-pink-400 to-rose-400 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="w-48 h-56 bg-gradient-to-b from-blue-900 to-black rounded-2xl flex items-center justify-center">
                  <Camera className="w-16 h-16 text-pink-300" />
                </div>
                <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
                <Heart className="absolute bottom-4 left-4 w-6 h-6 text-pink-200 animate-bounce" />
                <Star className="absolute bottom-4 right-4 w-6 h-6 text-yellow-200 animate-spin-slow" />
              </div>
            </div>
            <div className="w-48 h-8 bg-black/10 rounded-full mx-auto mt-4 blur-md" />
          </div>
          
          <h1 className="text-5xl font-bold text-purple-800 mb-2 animate-fade-in" style={{ fontFamily: 'Fredoka One, cursive' }}>
            Cute Photobooth
          </h1>
          <p className="text-purple-600 text-lg mb-8" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Capture your moments in style!
          </p>
          
          <Button 
            onClick={goToTemplates}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all animate-bounce-in"
            style={{ fontFamily: 'Fredoka One, cursive' }}
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start Capturing
          </Button>
          
          <div className="flex justify-center gap-6 mt-12">
            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mb-2">
                <ImageIcon className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-sm text-purple-700">18 Templates</span>
            </div>
            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mb-2">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-700">14 Filters</span>
            </div>
            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-purple-700">125 Stickers</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Template Selection Screen
  if (currentScreen === 'templates') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
        <div ref={containerRef} className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={goToHome} className="text-purple-700 hover:bg-pink-100">
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </Button>
            <h2 className="text-3xl font-bold text-purple-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
              Choose a Template
            </h2>
            <div className="w-20" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {templates.map((template, index) => (
              <div 
                key={template.id}
                onClick={() => goToCamera(template)}
                className="cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden mb-2">
                    <img 
                      src={getTemplateImage(template.src.split('/').pop() || '')} 
                      alt={template.name}
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                      onError={(e) => { (e.target as any).src = '/templates/' + template.src.split('/').pop(); }}
                    />
                  </div>
                  <p className="text-center text-purple-700 font-semibold text-sm">{template.name}</p>
                  <p className="text-center text-purple-400 text-xs">{template.photoSlots.length} photos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Camera Screen
  if (currentScreen === 'camera') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 relative">
        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Heart className="absolute top-20 left-10 w-8 h-8 text-pink-300 animate-float-slow opacity-50" />
          <Star className="absolute top-40 right-10 w-6 h-6 text-yellow-300 animate-float-slow opacity-50" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-40 left-20 w-5 h-5 text-purple-300 animate-float-slow opacity-50" style={{ animationDelay: '2s' }} />
        </div>
        
        <div ref={containerRef} className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={goToHome} className="text-purple-700 hover:bg-pink-100">
              <ChevronLeft className="w-5 h-5 mr-1" /> Cancel
            </Button>
            <h2 className="text-2xl font-bold text-purple-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
              Photo Booth
            </h2>
            <div className="w-20" />
          </div>
          
          {/* Photo Count Selector */}
          {!isCapturing && capturedPhotos.length === 0 && (
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="flex justify-center gap-2 flex-wrap">
                {[2, 3, 4, 5].map(count => (
                  <Button
                    key={count}
                    variant={photoCount === count ? 'default' : 'outline'}
                    onClick={() => setPhotoCount(count)}
                    className={photoCount === count ? 'bg-pink-400' : 'border-pink-300'}
                    size="sm"
                  >
                    {count}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-700 text-sm">Custom:</span>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={customPhotoCount}
                  onChange={(e) => {
                    setCustomPhotoCount(e.target.value)
                    const val = parseInt(e.target.value)
                    if (val >= 1 && val <= 10) setPhotoCount(val)
                  }}
                  placeholder="1-10"
                  className="w-20 text-center"
                />
                <span className="text-purple-700 text-sm">photos</span>
              </div>
            </div>
          )}
          
          {/* 3D Booth Container */}
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="bg-gradient-to-br from-pink-300 via-pink-400 to-rose-400 rounded-3xl p-6 shadow-2xl animate-pulse-glow">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  style={{ filter: filters.find(f => f.id === currentFilter)?.css }}
                />
                
                {flash && <div className="absolute inset-0 bg-white animate-flash" />}
                
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-bold text-white drop-shadow-lg animate-bounce countdown-number">
                      {countdown}
                    </span>
                  </div>
                )}
                
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <p className="text-white">Loading camera...</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-2 mt-4 flex-wrap max-h-28 overflow-y-auto p-1">
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant={currentFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentFilter(filter.id)}
                    className={currentFilter === filter.id ? 'bg-purple-500' : 'bg-white/80'}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <Heart className="absolute -left-4 top-1/4 w-8 h-8 text-pink-400 animate-bounce" />
            <Star className="absolute -right-4 top-1/3 w-8 h-8 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -left-2 bottom-1/4 w-6 h-6 text-purple-400 animate-spin" />
          </div>
          
          <div className="flex justify-center mt-8">
            {!isCapturing ? (
              <Button
                onClick={startCapture}
                disabled={!cameraReady}
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                style={{ fontFamily: 'Fredoka One, cursive' }}
              >
                <Camera className="w-6 h-6 mr-2" />
                Take {photoCount} Photos
              </Button>
            ) : (
              <div className="text-center animate-pulse">
                <p className="text-purple-700 text-lg">
                  Photo {capturedPhotos.length + 1} of {photoCount}
                </p>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    )
  }

  // Edit Screen
  if (currentScreen === 'edit') {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div ref={containerRef} className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={goToHome} className="text-purple-700 hover:bg-pink-100">
              <RefreshCw className="w-4 h-4 mr-2" /> Start Over
            </Button>
            <h2 className="text-2xl font-bold text-purple-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
              Edit Your Photos
            </h2>
            <Button 
              onClick={() => setCurrentScreen('preview')}
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="w-4 h-4 mr-2" /> Done
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Canvas Area - Smaller and lower */}
            <div className="flex-1 flex justify-center overflow-auto">
              <div 
                className="relative bg-white rounded-2xl shadow-xl overflow-visible"
                style={{ 
                  width: selectedTemplate.width * 0.85, 
                  height: selectedTemplate.height * 0.85,
                  maxWidth: '100%',
                  flexShrink: 0
                }}
              >
                {/* Background */}
                <div className="absolute inset-0" style={{ background: '#FFF0F5' }} />
                
                {/* Photo Slots with Images */}
                {selectedTemplate.photoSlots.map((slot, index) => {
                  const photo = capturedPhotos[index]
                  if (!photo) return null
                  
                  const isSelected = selectedPhotoId === photo.id
                  
                  return (
                    <div
                      key={photo.id}
                      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-pink-400' : ''}`}
                      style={{
                        left: (slot.x + photo.x) * 0.85,
                        top: (slot.y + photo.y) * 0.85,
                        width: slot.width * photo.scale * 0.85,
                        height: slot.height * photo.scale * 0.85,
                        zIndex: 5,
                        transform: `rotate(${photo.rotation}deg)`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'photo', photo.id)}
                    >
                      <img
                        src={photo.src}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ filter: filters.find(f => f.id === photo.filter)?.css }}
                        draggable={false}
                      />
                    </div>
                  )
                })}
                
                {/* Texts */}
                {texts.map(text => {
                  const isSelected = selectedTextId === text.id
                  return (
                    <div
                      key={text.id}
                      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-pink-400' : ''}`}
                      style={{
                        left: text.x * 0.85,
                        top: text.y * 0.85,
                        zIndex: 80,
                        transform: `rotate(${text.rotation}deg)`,
                        fontFamily: text.font,
                        fontSize: text.size * 0.85,
                        color: text.color
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'text', text.id)}
                    >
                      {text.text}
                    </div>
                  )
                })}
                
                {/* Stickers - ON TOP */}
                {stickers.map(sticker => {
                  const isSelected = selectedStickerId === sticker.id
                  return (
                    <div
                      key={sticker.id}
                      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-pink-400' : ''}`}
                      style={{
                        left: sticker.x * 0.85,
                        top: sticker.y * 0.85,
                        width: 80 * sticker.scale * 0.85,
                        height: 80 * sticker.scale * 0.85,
                        transform: `rotate(${sticker.rotation}deg)`,
                        zIndex: 100
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'sticker', sticker.id)}
                    >
                      <img
                        src={sticker.src}
                        alt="Sticker"
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  )
                })}
                
                {/* Template Overlay */}
                <img
                  src={getTemplateImage(selectedTemplate.src.split('/').pop() || '')}
                  alt="Template"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  crossOrigin="anonymous"
                  style={{ zIndex: 50 }}
                />
                
                {/* Hidden Canvas for Export */}
                <canvas 
                  ref={editCanvasRef} 
                  className="hidden"
                  width={selectedTemplate.width}
                  height={selectedTemplate.height}
                />
              </div>
            </div>
            
            {/* Tools Panel */}
            <div className="w-full lg:w-96 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Stickers with Categories - Scrollable */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" /> Stickers (125)
                </h3>
                <Tabs defaultValue="cute" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-2">
                    {Object.entries(stickerCategories).map(([key, cat]) => (
                      <TabsTrigger key={key} value={key} className="p-1">
                        <cat.icon className="w-4 h-4" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(stickerCategories).map(([key, cat]) => (
                    <TabsContent key={key} value={key}>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                        {cat.stickers.map(sticker => (
                          <button
                            key={sticker.id}
                            onClick={() => addSticker(sticker.src)}
                            className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg hover:from-pink-100 hover:to-purple-100 transition-colors flex items-center justify-center"
                          >
                            <img 
                              src={sticker.src} 
                              alt={sticker.id}
                              className="w-10 h-10 object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              {/* Text Tool */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                  <Type className="w-5 h-5 mr-2" /> Add Text
                </h3>
                <div className="space-y-2">
                  <Input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Enter text..."
                    onKeyPress={(e) => e.key === 'Enter' && addText()}
                  />
                  <div className="flex gap-2">
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="flex-1 p-2 border rounded-lg text-sm"
                    >
                      {fontOptions.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <Button onClick={addText} className="w-full bg-pink-400 hover:bg-pink-500">
                    <Plus className="w-4 h-4 mr-2" /> Add Text
                  </Button>
                </div>
              </div>
              
              {/* Selected Sticker Controls */}
              {selectedStickerId && (
                <div className="bg-white rounded-2xl p-4 shadow-lg animate-slide-up">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">Sticker Controls</h3>
                  {stickers.filter(s => s.id === selectedStickerId).map(sticker => (
                    <div key={sticker.id} className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Size</label>
                        <Slider
                          value={[sticker.scale]}
                          min={0.5}
                          max={5}
                          step={0.1}
                          onValueChange={([v]) => updateSticker(sticker.id, { scale: v })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Rotation</label>
                        <Slider
                          value={[sticker.rotation]}
                          min={-180}
                          max={180}
                          step={5}
                          onValueChange={([v]) => updateSticker(sticker.id, { rotation: v })}
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteSticker(sticker.id)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Selected Text Controls */}
              {selectedTextId && (
                <div className="bg-white rounded-2xl p-4 shadow-lg animate-slide-up">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">Text Controls</h3>
                  {texts.filter(t => t.id === selectedTextId).map(text => (
                    <div key={text.id} className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Size</label>
                        <Slider
                          value={[text.size]}
                          min={12}
                          max={72}
                          step={2}
                          onValueChange={([v]) => updateText(text.id, { size: v })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Rotation</label>
                        <Slider
                          value={[text.rotation]}
                          min={-180}
                          max={180}
                          step={5}
                          onValueChange={([v]) => updateText(text.id, { rotation: v })}
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteText(text.id)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Photo Controls */}
              {selectedPhotoId && (
                <div className="bg-white rounded-2xl p-4 shadow-lg animate-slide-up">
                  <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                    <Crop className="w-4 h-4 mr-2" /> Photo Controls
                  </h3>
                  {capturedPhotos.filter(p => p.id === selectedPhotoId).map(photo => (
                    <div key={photo.id} className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Zoom</label>
                        <Slider
                          value={[photo.scale]}
                          min={0.5}
                          max={3}
                          step={0.1}
                          onValueChange={([v]) => updatePhoto(photo.id, { scale: v })}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 flex items-center">
                          <RotateCw className="w-3 h-3 mr-1" /> Rotation
                        </label>
                        <Slider
                          value={[photo.rotation]}
                          min={-180}
                          max={180}
                          step={5}
                          onValueChange={([v]) => updatePhoto(photo.id, { rotation: v })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Instructions */}
              <div className="bg-purple-50 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-purple-800 mb-2">Tips:</h3>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• Drag photos freely - no boundaries!</li>
                  <li>• Click stickers to add them</li>
                  <li>• Add text with different fonts</li>
                  <li>• Use sliders to resize/rotate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Preview Screen
  if (currentScreen === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 relative">
        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Star className="absolute top-10 left-10 w-6 h-6 text-yellow-300 animate-float-slow" />
          <Heart className="absolute top-20 right-20 w-5 h-5 text-pink-300 animate-float-slow" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-20 left-20 w-4 h-4 text-purple-300 animate-float-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div ref={containerRef} className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-purple-800 mb-6 animate-fade-in" style={{ fontFamily: 'Fredoka One, cursive' }}>
            Your Photo Strip!
          </h2>
          
          {/* Final Image */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-2xl inline-block animate-scale-in">
              <canvas 
                ref={editCanvasRef}
                className="max-w-full max-h-[60vh]"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-center gap-4 animate-slide-up">
            <Button
              onClick={goToEdit}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Edit3 className="w-4 h-4 mr-2" /> Back to Edit
            </Button>
            <Button
              onClick={goToHome}
              variant="outline"
              className="border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Start Over
            </Button>
            <Button
              onClick={downloadImage}
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
