// @ts-nocheck
export function initializeLandingCanvases(root) {
  if (!(root instanceof Element)) return () => {};

  const cleanups = [];
  initializeHeroCanvas(root, cleanups);
  initializeFormatGlobe(root, cleanups);

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    cleanups.splice(0).reverse().forEach(cleanup => cleanup());
  };
}

function initializeHeroCanvas(root, cleanups) {
    'use strict';

    const hero = root.querySelector('#top');
    const canvas = root.querySelector('#hero-b-pixel-field');
    const scanCanvas = root.querySelector('.hero-scan-overlay');
    const scanContext = scanCanvas?.getContext('2d');
    const productHeading = root.querySelector('#playground .section-heading');
    const copy = hero?.querySelector('.hero-copy');
    const visual = hero?.querySelector('.hero-visual');
    const tooltip = root.querySelector('#hero-b-pixel-tooltip');
    const header = document.querySelector('.kh-site-header');
    const ctx = canvas?.getContext('2d');
    if (!hero || !canvas || !copy || !visual || !tooltip || !ctx || !scanContext) return;
    canvas.dataset.heroCanvasOwned = 'true';
    const controller = new AbortController();
    const { signal } = controller;
    let active = true;
    const currentColor = (property, fallback) => getComputedStyle(document.documentElement)
      .getPropertyValue(property).trim() || fallback;

    const SETTINGS = Object.freeze({
      cellSize: 6,
      fieldScale: .98,
      motionSpeed: 1.18,
      trailDecay: .925,
      brushRadius: 10,
      interactionStrength: .19,
      seed: 17
    });
    const currentPrimary = () => currentColor('--page-primary', '#19A88B');
    const RED_FLOW_COLOR = currentColor('--coral-signal-500', '#FF634A');
    let primary500 = currentPrimary();
    const STAGE_COLORS = Array(5).fill(primary500);
    const LAYER_COLORS = STAGE_COLORS.slice(1);
    let heroInkColor = primary500;
    let heroShadowColor = primary500;
    let heroPaperColor = currentColor('--white-100', '#FFFFFF');
    let heroLabelTitleColor = currentColor('--mist-white-900', '#2E2E2C');
    let heroLabelSubtitleColor = currentColor('--mist-white-700', '#888A82');
    let heroGridColor = currentColor('--black-6', 'rgba(0, 0, 0, 0.06)');
    const syncPrimary = () => {
      primary500 = currentPrimary();
      STAGE_COLORS.fill(primary500);
      LAYER_COLORS.fill(primary500);
      heroInkColor = primary500;
      heroShadowColor = primary500;
      heroPaperColor = currentColor('--white-100', '#FFFFFF');
      heroLabelTitleColor = currentColor('--mist-white-900', '#2E2E2C');
      heroLabelSubtitleColor = currentColor('--mist-white-700', '#888A82');
      heroGridColor = currentColor('--black-6', 'rgba(0, 0, 0, 0.06)');
    };
    window.addEventListener('main-palette-change', syncPrimary, { signal });
    const vortexControls = {
      direction: 'counterclockwise',
      flowSpeed: .026,
      rotationSpeed: .03,
      mouthSpeed: .055,
      twistPerStage: 1.95,
      middleTwist: 4.45,
      baseTwist: -1,
      speedVariation: .04,
      centerPosition: .55,
      fieldScale: .96,
      stageSpacing: .8,
      innerShell: .49,
      perspective: .11,
      orbitHeight: .15,
      cameraYaw: 0,
      cameraLift: 80,
      cameraRoll: 0,
      waistWidth: .095,
      firstExpansion: .29,
      finalExpansion: 1,
      fadeDistance: 108,
      mouthEnabled: false,
      mouthCount: 500,
      mouthDensity: 1.25,
      streamDensity: .85,
      ridgeFrequency: 2.4,
      ridgeStrength: .28,
      middleLayering: .52,
      depthDensity: .5,
      depthAlpha: .05,
      overallAlpha: .75,
      redFlowDelay: 0,
      redFlowDuration: 6.5,
      redFlowInterval: 2,
      redFlowLine1ExtraDelay: 0,
      redFlowLine2ExtraDelay: 0,
      redFlowLine3ExtraDelay: 0,
      redFlowLine4ExtraDelay: 0,
      redFlowLine5ExtraDelay: 0,
      redFlowTurnPosition: .62,
      redFlowLine1StartAngle: 171,
      redFlowLine1EndAngle: 91,
      redFlowLine2StartAngle: 193,
      redFlowLine2EndAngle: 113,
      redFlowLine3StartAngle: 215,
      redFlowLine3EndAngle: 135,
      redFlowLine4StartAngle: 237,
      redFlowLine4EndAngle: 157,
      redFlowLine5StartAngle: 259,
      redFlowLine5EndAngle: 179,
      redFlowLineAlpha: .95,
      redFlowLineWidth: 1.1,
      redFlowSilhouetteFade: .18,
      redFlowMouthOpen: .9,
      redFlowBaseOpen: 4.8,
      emberAmount: .45,
      emberAlpha: 1.1,
      enabled: false,
      count: 33,
      speed: .02,
      baseSpread: 1.7,
      spreadGrowth: 4.4,
      turns: 1,
      alpha: .42,
      allLabelsY: 50,
      hoverHeight: 150,
      originalDocumentY: 96,
      pageImagesY: 120,
      lightweightNotesY: 120,
      chapterMapY: 106
    };
    window.addEventListener('hero-vortex-controls', event => {
      const redFlow = event.detail?.redParticleFlow;
      const timingChanged = redFlow && [
        'redFlowDelay',
        'redFlowDuration',
        'redFlowInterval',
        'redFlowLine1ExtraDelay',
        'redFlowLine2ExtraDelay',
        'redFlowLine3ExtraDelay',
        'redFlowLine4ExtraDelay',
        'redFlowLine5ExtraDelay'
      ].some(key => redFlow[key] !== vortexControls[key]);
      Object.values(event.detail || {}).forEach(group => {
        if (group && typeof group === 'object') Object.assign(vortexControls, group);
      });
      if (timingChanged) redFlowStartedAt = animationTime;
    }, { signal });
    const DATA = [
      { count: 176, width: 1 },
      { count: 112, width: .56 },
      { count: 72, width: .34 },
      { count: 40, width: .17 },
      { count: 16, width: .055 },
      { count: 48, width: .28 },
      { count: 112, width: .68 }
    ];
    const LAYER_COPY = {
      en: [
        { label: 'ORIGINAL DOCUMENT', detail: 'The document stays intact.' },
        { label: 'PAGE IMAGES', detail: 'Every page, ready to inspect.' },
        { label: 'LIGHTWEIGHT NOTES', detail: 'Topics stay tied to their chapters.' },
        { label: 'CHAPTER MAP', detail: 'A clear path back to the source.' }
      ],
      zh: [
        { label: '原始文档', detail: '文档内容保持完整。' },
        { label: '页面图像', detail: '每一页都可随时查看。' },
        { label: '轻量笔记', detail: '主题始终关联对应章节。' },
        { label: '章节地图', detail: '清晰返回原始来源的路径。' }
      ]
    };
    const readSiteLanguage = () => {
      const lang = document.documentElement.lang || document.body.dataset.language || 'en';
      return lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    };
    let heroLanguage = readSiteLanguage();
    const LAYERS = LAYER_COPY[heroLanguage].map(layer => ({ ...layer }));
    let liveDataPassLabel = heroLanguage === 'zh' ? '实时数据流' : 'Live data pass';
    const syncHeroLanguage = event => {
      heroLanguage = (event.detail?.language ?? readSiteLanguage()) === 'zh' ? 'zh' : 'en';
      LAYER_COPY[heroLanguage].forEach((layer, index) => Object.assign(LAYERS[index], layer));
      liveDataPassLabel = heroLanguage === 'zh' ? '实时数据流' : 'Live data pass';
    };
    window.addEventListener('knowhere-language-change', syncHeroLanguage, { signal });
    const LABEL_ICON_PATHS = [
      'M21 9V20.9925C21 21.5511 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.44694 2 3.99826 2H14V8C14 8.55228 14.4477 9 15 9H21ZM21 7H16V2.00318L21 7ZM8 7V9H11V7H8ZM8 11V13H16V11H8ZM8 15V17H16V15H8Z',
      'M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z',
      'M15 14L14.8834 14.0067C14.4243 14.0601 14.0601 14.4243 14.0067 14.8834L14 15V21H3.99826C3.44694 21 3 20.5551 3 20.0066V3.9934C3 3.44476 3.44495 3 3.9934 3H20.0066C20.5552 3 21 3.44749 21 3.9985V14H15ZM21 16L16 20.997V16H21Z',
      'M7.10508 15.2101C8.21506 15.6501 9 16.7334 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.6938 3.83481 15.5825 5 15.1707V8.82929C3.83481 8.41746 3 7.30622 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.30622 8.16519 8.41746 7 8.82929V11.9996C7.83566 11.3719 8.87439 11 10 11H14C15.3835 11 16.5482 10.0635 16.8949 8.78991C15.7849 8.34988 15 7.26661 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.3332 20.1303 8.46329 18.9274 8.85392C18.5222 11.2085 16.4703 13 14 13H10C8.61653 13 7.45179 13.9365 7.10508 15.2101Z'
    ].map(path => new Path2D(path));
    const LABEL_Y_KEYS = ['originalDocumentY', 'pageImagesY', 'lightweightNotesY', 'chapterMapY'];
    const HERO_COPY_ACCENTS = [.16, .24, .12, .3, .18, .14, .2, .14, .22, .16, .22, .14, .28, .18, .24];
    // `length` is the lit window length in vortex stages.
    const RED_FLOW_TRAILS = [
      {
        delayKey: 'redFlowLine1ExtraDelay',
        startKey: 'redFlowLine1StartAngle',
        endKey: 'redFlowLine1EndAngle',
        length: 5.2
      },
      {
        delayKey: 'redFlowLine2ExtraDelay',
        startKey: 'redFlowLine2StartAngle',
        endKey: 'redFlowLine2EndAngle',
        length: 6
      },
      {
        delayKey: 'redFlowLine3ExtraDelay',
        startKey: 'redFlowLine3StartAngle',
        endKey: 'redFlowLine3EndAngle',
        length: 5.5
      },
      {
        delayKey: 'redFlowLine4ExtraDelay',
        startKey: 'redFlowLine4StartAngle',
        endKey: 'redFlowLine4EndAngle',
        length: 6.4
      },
      {
        delayKey: 'redFlowLine5ExtraDelay',
        startKey: 'redFlowLine5StartAngle',
        endKey: 'redFlowLine5EndAngle',
        length: 5.7
      }
    ];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const unitCounts = DATA.map(stage => stage.count);
    const selectEvenly = (previous, count) => Array.from(
      { length: Math.min(count, previous.length) },
      (_, index) => previous[Math.min(previous.length - 1, Math.floor((index + .5) * previous.length / count))]
    );
    const allTracks = Array.from({ length: unitCounts[0] }, (_, index) => index);
    const stageTracks = [allTracks];
    for (let stage = 1; stage <= LAYERS.length; stage += 1) {
      stageTracks.push(selectEvenly(stageTracks[stage - 1], unitCounts[stage]));
    }
    for (let stage = LAYERS.length + 1; stage < DATA.length; stage += 1) {
      stageTracks.push(selectEvenly(allTracks, unitCounts[stage]));
    }
    const stageTrackSets = stageTracks.map(tracks => new Set(tracks));

    let width = 0;
    let height = 0;
    let scanWidth = 0;
    let scanHeight = 0;
    let dpr = 1;
    let cell = SETTINGS.cellSize;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let hoveredTrack = null;
    let hoveredLayer = null;
    let hoverFlowLayer = null;
    let hoverFlowStarted = 0;
    let clickFlowLayer = null;
    let clickFlowStarted = 0;
    let selectedLayer = null;
    let morphFromLayer = null;
    let morphToLayer = null;
    let morphStarted = -1;
    let pointerX = -1;
    let pointerY = -1;
    let previousX = -1;
    let previousY = -1;
    let visible = true;
    let intro = 0;
    let lastFrame = 0;
    let frameId = 0;
    let resizeFrameId = 0;
    let animationTime = 0;
    let redFlowStartedAt = null;
    const MORPH_DURATION = .46;
    const MORPH_POINT_COUNT = 680;
    const SHAPE_ANNOTATION_MIN_GAP = 24;
    const SHAPE_ANNOTATION_MAX_GAP = 40;

    const hash = (x, y) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + SETTINGS.seed * .13) * 43758.5453;
      return value - Math.floor(value);
    };
    const wrapAngle = value => Math.atan2(Math.sin(value), Math.cos(value));

    function applyCanvasSize() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const nextDpr = Math.min(devicePixelRatio || 1, 2);
      if (scanWidth !== innerWidth || scanHeight !== innerHeight || dpr !== nextDpr) {
        scanWidth = innerWidth;
        scanHeight = innerHeight;
        scanCanvas.width = Math.round(scanWidth * nextDpr);
        scanCanvas.height = Math.round(scanHeight * nextDpr);
        scanContext.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);
      }
      if (width === nextWidth && height === nextHeight && dpr === nextDpr) return;

      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      cell = SETTINGS.cellSize;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell) + 1;
      rows = Math.ceil(height / cell) + 1;
      heat = new Float32Array(cols * rows);
      pointerX = -1;
      pointerY = -1;
      previousX = -1;
      previousY = -1;
    }

    function resize() {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => {
        resizeFrameId = 0;
        applyCanvasSize();
      });
    }

    function buildLayout() {
      const canvasRect = canvas.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const visualLeft = visualRect.left - canvasRect.left;
      const visualTop = visualRect.top - canvasRect.top;
      const isTwoColumnHero = width >= 1100;
      const viewportWidth = window.innerWidth;
      const compactDesktopProgress = Math.max(0, Math.min(1, (viewportWidth - 1200) / (1366 - 1200)));
      const compactDesktopScale = .72 + compactDesktopProgress * .1;
      const desktopCenterPosition = .43;
      const centerX = isTwoColumnHero
        ? visualLeft + visualRect.width * desktopCenterPosition
        : visualLeft + visualRect.width * .5;
      const desktopMaxWidth = isTwoColumnHero
        ? Math.min(width * .92, 1080)
        : visualRect.width * .96;
      const maxWidth = desktopMaxWidth
        * (isTwoColumnHero ? compactDesktopScale : 1)
        * vortexControls.fieldScale;
      const stageSpan = Math.min(visualRect.height * .98, 580) * 1.2;
      const isDesktopLayout = isTwoColumnHero;
      const navHeight = header?.getBoundingClientRect().height || 68;
      const topY = isDesktopLayout
        ? navHeight + 2
        : visualTop + Math.max(18, visualRect.height * .018);
      const heroBottom = heroRect.bottom - canvasRect.top;
      const isStackedLayout = !isTwoColumnHero;
      const stageGap = isStackedLayout
        ? Math.max(38, (heroBottom - topY - 96) / (DATA.length - 1))
        : stageSpan / (LAYERS.length + .25) * vortexControls.stageSpacing;
      return {
        centerX,
        maxWidth,
        topY,
        stageGap,
        heroBottom,
        visualLeft,
        visualTop,
        visualWidth: visualRect.width,
        visualHeight: visualRect.height,
        isDesktopLayout,
        showLayerCards: width >= 1024
      };
    }

    function pointAtStage(layout, trackId, stagePosition, rotationPhase = null, phaseOverride = null) {
      const clampedStage = Math.max(0, Math.min(DATA.length - 1, stagePosition));
      const lowerStage = Math.min(DATA.length - 2, Math.floor(clampedStage));
      const stageMix = clampedStage - lowerStage;
      const eased = stageMix * stageMix * (3 - 2 * stageMix);
      const widthRatioAt = stageIndex => {
        if (stageIndex === LAYERS.length) return vortexControls.waistWidth;
        if (stageIndex === LAYERS.length + 1) return vortexControls.firstExpansion;
        if (stageIndex === LAYERS.length + 2) return vortexControls.finalExpansion;
        return DATA[stageIndex].width;
      };
      const widthRatioAtPosition = position => {
        const waistStage = LAYERS.length;
        if (position >= 2 && position <= waistStage) {
          const startWidth = widthRatioAt(2);
          const middleWidth = widthRatioAt(3);
          const waistWidth = vortexControls.waistWidth;
          const middleRatio = Math.max(.001, Math.min(.999,
            (middleWidth - waistWidth) / Math.max(.001, startWidth - waistWidth)
          ));
          const exponent = Math.log(middleRatio) / Math.log(.5);
          const remaining = (waistStage - position) / (waistStage - 2);
          return waistWidth + (startWidth - waistWidth) * remaining ** exponent;
        }
        if (position > waistStage) {
          const waistWidth = vortexControls.waistWidth;
          const firstExpansion = vortexControls.firstExpansion;
          const finalExpansion = vortexControls.finalExpansion;
          const middleRatio = Math.max(.001, Math.min(.999,
            (firstExpansion - waistWidth) / Math.max(.001, finalExpansion - waistWidth)
          ));
          const exponent = Math.log(middleRatio) / Math.log(.5);
          const progress = (position - waistStage) / 2;
          return waistWidth + (finalExpansion - waistWidth) * progress ** exponent;
        }
        return widthRatioAt(lowerStage)
          + (widthRatioAt(lowerStage + 1) - widthRatioAt(lowerStage)) * eased;
      };
      const widthAtPosition = clampedStage < 1 && layout.isDesktopLayout
        ? width + cell * 2 + (
          layout.maxWidth * widthRatioAt(1) - width - cell * 2
        ) * eased
        : layout.maxWidth * widthRatioAtPosition(clampedStage);
      const centerAt = stageIndex => stageIndex === 0 && layout.isDesktopLayout ? width / 2 : layout.centerX;
      const radius = widthAtPosition * .5;
      const localCenter = centerAt(lowerStage) + (centerAt(lowerStage + 1) - centerAt(lowerStage)) * eased;
      const shell = vortexControls.innerShell
        + hash(trackId + 17, 73) * (1 - vortexControls.innerShell);
      const trackPhase = phaseOverride
        ?? trackId / Math.max(1, unitCounts[0]) * Math.PI * 2;
      const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
      const rotation = reducedMotion
        ? 0
        : rotationPhase ?? animationTime * vortexControls.rotationSpeed;
      const middleStart = 1.15;
      const middleEnd = LAYERS.length + .15;
      const middleLinear = Math.max(0, Math.min(1,
        (clampedStage - middleStart) / (middleEnd - middleStart)
      ));
      const middleProgress = middleLinear * middleLinear * (3 - 2 * middleLinear);
      const baseLinear = Math.max(0, Math.min(1,
        (clampedStage - middleEnd) / (DATA.length - 1 - middleEnd)
      ));
      const baseProgress = baseLinear * baseLinear * (3 - 2 * baseLinear);
      const angle = trackPhase + direction * (
        clampedStage * vortexControls.twistPerStage
          + middleProgress * vortexControls.middleTwist
          + baseProgress * vortexControls.baseTwist
          + rotation
      );
      const depth = (Math.sin(angle) + 1) * .5;
      const perspective = 1 - vortexControls.perspective + depth * vortexControls.perspective;
      const orbitHeight = Math.min(radius * vortexControls.orbitHeight, layout.stageGap * .3);
      const radialX = Math.cos(angle) * radius * shell * perspective
        + Math.sin(angle) * radius * shell * vortexControls.cameraYaw;
      const depthY = Math.sin(angle) * orbitHeight * shell
        + (depth - .5) * vortexControls.cameraLift;
      const roll = vortexControls.cameraRoll * Math.PI / 180;
      const rollCosine = Math.cos(roll);
      const rollSine = Math.sin(roll);
      const baseX = localCenter + radialX * rollCosine - depthY * rollSine;
      const baseY = layout.topY + layout.stageGap * clampedStage
        + radialX * rollSine + depthY * rollCosine;
      return { x: baseX, y: baseY, depth, shell, angle, stagePosition, radius, localCenter };
    }

    function pointOnSegment(layout, trackId, stage, progress) {
      return pointAtStage(layout, trackId, stage + progress);
    }

    function createPixelShape(layerIndex) {
      const pixels = new Map();
      const add = (x, y, alpha = 1) => {
        const key = `${x},${y}`;
        const current = pixels.get(key);
        if (!current || current.alpha < alpha) pixels.set(key, { x, y, alpha });
      };
      const line = (x0, y0, x1, y1, alpha = 1) => {
        const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let step = 0; step <= steps; step += 1) {
          const progress = steps ? step / steps : 0;
          add(Math.round(x0 + (x1 - x0) * progress), Math.round(y0 + (y1 - y0) * progress), alpha);
        }
      };
      const rect = (x, y, w, h, alpha = 1) => {
        line(x, y, x + w, y, alpha);
        line(x + w, y, x + w, y + h, alpha);
        line(x + w, y + h, x, y + h, alpha);
        line(x, y + h, x, y, alpha);
      };
      const node = (x, y, size = 3, alpha = 1) => {
        for (let row = 0; row < size; row += 1) {
          for (let column = 0; column < size; column += 1) add(x + column, y + row, alpha);
        }
      };

      if (layerIndex === 0) {
        line(2, 8, 2, 27);
        line(2, 8, 11, 8);
        line(11, 8, 14, 4);
        line(14, 4, 23, 4);
        line(23, 4, 26, 8);
        line(26, 8, 32, 8);
        line(32, 8, 32, 27);
        line(32, 27, 2, 27);
        line(2, 12, 32, 12, .72);
        for (let y = 14; y < 27; y += 1) {
          for (let x = 4; x < 31; x += 1) {
            if ((x * 3 + y * 5) % 7 < 2) add(x, y, .32 + hash(x + 1301, y + 1321) * .28);
          }
        }
      } else if (layerIndex === 1) {
        rect(4, 3, 22, 27, .42);
        rect(7, 5, 22, 27, .58);
        rect(10, 7, 22, 27, 1);
        rect(13, 11, 16, 13, .82);
        line(13, 23, 19, 17, .88);
        line(19, 17, 23, 21, .88);
        line(23, 21, 29, 14, .88);
        node(15, 13, 3, .92);
        for (let x = 13; x < 30; x += 3) add(x, 28, .5);
      } else if (layerIndex === 2) {
        rect(5, 3, 25, 31, 1);
        line(23, 3, 30, 10, .72);
        line(23, 3, 23, 10, .72);
        line(23, 10, 30, 10, .72);
        const lengths = [15, 18, 13, 19, 16, 11];
        lengths.forEach((length, row) => {
          node(9, 14 + row * 3, 2, .78);
          line(13, 14 + row * 3, 13 + length, 14 + row * 3, row === 0 ? .9 : .58);
        });
        for (let x = 8; x < 27; x += 2) add(x, 8, .34);
      } else {
        const connections = [
          [17, 4, 17, 10], [17, 10, 8, 16], [17, 10, 26, 16],
          [8, 16, 5, 25], [8, 16, 13, 25], [26, 16, 22, 25], [26, 16, 30, 25],
          [13, 25, 17, 31], [22, 25, 17, 31]
        ];
        connections.forEach(([x0, y0, x1, y1], index) => {
          line(x0, y0, x1, y1, index < 3 ? .84 : .56);
          line(x0 + 1, y0, x1 + 1, y1, .28);
        });
        [[15, 2], [15, 9], [6, 15], [24, 15], [3, 24], [11, 24], [20, 24], [28, 24], [15, 30]].forEach(
          ([x, y], index) => node(x, y, index === 0 || index === 8 ? 5 : 4, index < 4 ? 1 : .78)
        );
      }
      const basePixels = [...pixels.values()];
      const densePixels = new Map();
      const addDense = (x, y, alpha) => {
        const key = `${x},${y}`;
        const current = densePixels.get(key);
        if (!current || current.alpha < alpha) densePixels.set(key, { x, y, alpha });
      };
      const denseOffsets = [
        { value: 0, alpha: 1 },
        { value: 1 / 3, alpha: .78 },
        { value: 2 / 3, alpha: .62 }
      ];
      basePixels.forEach(point => {
        denseOffsets.forEach(offsetX => denseOffsets.forEach(offsetY => {
          addDense(
            point.x + offsetX.value,
            point.y + offsetY.value,
            point.alpha * Math.min(offsetX.alpha, offsetY.alpha)
          );
        }));
      });
      return [...densePixels.values()];
    }

    const PIXEL_SHAPES = LAYERS.map((_, layerIndex) => createPixelShape(layerIndex));

    function normalizeMorphPoints(points) {
      if (points.length === MORPH_POINT_COUNT) return points;
      if (points.length > MORPH_POINT_COUNT) {
        return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => points[
          Math.min(points.length - 1, Math.floor((index + .5) * points.length / MORPH_POINT_COUNT))
        ]);
      }
      return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => {
        const point = points[index % points.length];
        return { ...point, alpha: point.alpha * (index < points.length ? 1 : .08) };
      });
    }

    function funnelMorphPoints(layout) {
      const points = [];
      for (let stage = 0; stage < DATA.length - 1; stage += 1) {
        stageTracks[stage + 1].forEach(trackId => {
          for (let sample = 0; sample < 4; sample += 1) {
            const point = pointOnSegment(layout, trackId, stage, sample / 4);
            points.push({ ...point, alpha: .56 + hash(trackId + 1409, stage * 7 + sample) * .38 });
          }
        });
      }
      return normalizeMorphPoints(points);
    }

    function modeMorphPoints(layout, layerIndex) {
      if (layerIndex === null) return funnelMorphPoints(layout);
      const shape = PIXEL_SHAPES[layerIndex];
      const centerY = layout.visualTop + layout.visualHeight / 2;
      const shapeScale = width < 768 ? 1.48 : 1.68;
      const compactShift = width >= 768 && width < 1200
        ? Math.min(cell * 6, (1200 - width) * .18)
        : 0;
      const shapeCenterX = 17;
      const shapeCenterY = 18;
      return normalizeMorphPoints(shape.map(point => ({
        x: layout.centerX - compactShift + (point.x - shapeCenterX) * cell * shapeScale,
        y: centerY + (point.y - shapeCenterY) * cell * shapeScale,
        alpha: point.alpha
      })));
    }

    function morphState(time) {
      if (morphStarted < 0) return { from: selectedLayer, to: selectedLayer, progress: 1 };
      const linear = Math.max(0, Math.min(1, (time - morphStarted) / MORPH_DURATION));
      const progress = linear * linear * (3 - 2 * linear);
      return { from: morphFromLayer, to: morphToLayer, progress };
    }

    function funnelOpacityAt(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) return 1 - state.progress;
      if (state.to === null) return state.progress;
      return 0;
    }

    function layerCardVisibility(layerIndex, time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) {
        return layerIndex === state.to
          ? 1 - Math.min(1, state.progress / .36)
          : 1 - state.progress;
      }
      if (state.to === null) return Math.max(0, Math.min(1, (state.progress - .28) / .72));
      if (layerIndex === state.from) return 1 - state.progress;
      return 0;
    }

    function shapeCardPresentation(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return { layerIndex: null, visibility: 0 };
      const elapsed = Math.max(0, time - morphStarted);
      if (state.from === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, (elapsed - .16) / .36));
        return { layerIndex: state.to, visibility: 1 - (1 - progress) ** 3 };
      }
      if (state.to === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, elapsed / .22));
        return { layerIndex: state.from, visibility: 1 - progress ** 2 };
      }
      return { layerIndex: state.to, visibility: state.progress };
    }

    function mixHexColor(from, to, progress) {
      const read = color => [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      const fromRgb = read(from);
      const toRgb = read(to);
      return `rgb(${fromRgb.map((value, index) => Math.round(value + (toRgb[index] - value) * progress)).join(',')})`;
    }

    function drawModeMorph(layout, time) {
      if (morphStarted < 0 && selectedLayer === null) return;
      const state = morphState(time);
      const fromPoints = modeMorphPoints(layout, state.from);
      const toPoints = modeMorphPoints(layout, state.to);
      const fromColor = state.from === null ? STAGE_COLORS[0] : LAYER_COLORS[state.from];
      const toColor = state.to === null ? STAGE_COLORS[0] : LAYER_COLORS[state.to];
      const opacity = state.from === null ? state.progress : state.to === null ? 1 - state.progress : 1;
      const color = mixHexColor(fromColor, toColor, state.progress);
      const targetIsShape = state.to !== null;
      const bounds = targetIsShape ? toPoints.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }) : null;
      const flowTime = reducedMotion ? 0 : time;
      if (bounds) drawShapeAmbientRectangles(bounds, state.to, time, opacity);
      for (let index = 0; index < MORPH_POINT_COUNT; index += 1) {
        const from = fromPoints[index];
        const to = toPoints[index];
        let flow = 0;
        if (targetIsShape) {
          const horizontal = (to.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX);
          const vertical = (to.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY);
          const route = horizontal * .3 + vertical * .7 + hash(index + 1553, state.to + 1571) * .035;
          const phase = ((flowTime * .48 - route) % 1 + 1) % 1;
          if (phase < .18) flow = Math.sin(phase / .18 * Math.PI);
        }
        const orangeFlow = targetIsShape && state.progress > .8 && flow > .18
          && hash(index + 2111, state.to + 2129) < .28;
        drawPixel(
          from.x + (to.x - from.x) * state.progress,
          from.y + (to.y - from.y) * state.progress,
          (from.alpha + (to.alpha - from.alpha) * state.progress) * opacity * (.72 + flow * .46),
          orangeFlow ? RED_FLOW_COLOR : flow > 0 ? mixHexColor(color, heroShadowColor, flow * .11) : color
        );
      }
    }

    function drawShapeAmbientRectangles(bounds, layerIndex, time, visibility) {
      const horizontalPadding = Math.max(34, (bounds.maxX - bounds.minX) * .16);
      const verticalPadding = Math.max(28, (bounds.maxY - bounds.minY) * .14);
      ctx.save();
      ctx.fillStyle = LAYER_COLORS[layerIndex];
      for (let index = 0; index < 18; index += 1) {
        const flash = randomGridFlash(time, index, layerIndex * 101 + 1901);
        if (flash.alpha <= 0) continue;
        const seed = index + flash.generation * 37;
        const side = Math.floor(hash(seed + 1913, layerIndex + 1931) * 4);
        const progress = .06 + hash(seed + 1933, layerIndex + 1949) * .88;
        const offset = cell * (1 + Math.floor(hash(seed + 1951, layerIndex + 1973) * 5));
        let x;
        let y;
        if (side === 0 || side === 2) {
          x = bounds.minX + (bounds.maxX - bounds.minX) * progress;
          y = side === 0 ? bounds.minY - verticalPadding - offset : bounds.maxY + verticalPadding + offset;
        } else {
          x = side === 1 ? bounds.maxX + horizontalPadding + offset : bounds.minX - horizontalPadding - offset;
          y = bounds.minY + (bounds.maxY - bounds.minY) * progress;
        }
        ctx.globalAlpha = Math.min(.2, visibility * flash.alpha);
        fillGridBlock(
          Math.round(x / cell) * cell,
          Math.round(y / cell) * cell,
          1,
          1
        );
      }
      ctx.restore();
    }

    function drawShapeAnnotation(layout, time) {
      const presentation = shapeCardPresentation(time);
      if (presentation.layerIndex === null || presentation.visibility <= .001) return;

      const layerIndex = presentation.layerIndex;
      const layer = LAYERS[layerIndex];
      const color = LAYER_COLORS[layerIndex];
      const points = modeMorphPoints(layout, layerIndex);
      const bounds = points.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
      const shapeCenterY = (bounds.minY + bounds.maxY) / 2;
      const visibility = presentation.visibility;
      const rightInset = width < 1024 ? 16 : Math.max(24, width * .02);
      const labelWidth = Math.min(200, width - rightInset * 2);
      const gapProgress = Math.max(0, Math.min(1, (width - 1024) / (1440 - 1024)));
      const annotationGap = SHAPE_ANNOTATION_MIN_GAP
        + (SHAPE_ANNOTATION_MAX_GAP - SHAPE_ANNOTATION_MIN_GAP) * gapProgress;
      const preferredX = bounds.maxX + cell + annotationGap;
      const safeRight = Math.min(width - rightInset, layout.visualLeft + layout.visualWidth);
      const rightLimit = safeRight - labelWidth;
      const sideBySide = width >= 768 && preferredX <= rightLimit;
      const labelX = sideBySide
        ? rightLimit + (1 - visibility) * cell * 2
        : Math.max(rightInset, Math.min(
          width - rightInset - labelWidth,
          (bounds.minX + bounds.maxX - labelWidth) / 2
        ));
      const labelY = sideBySide
        ? shapeCenterY - 31
        : bounds.maxY + cell * 3;

      ctx.save();
      if (sideBySide) {
        ctx.fillStyle = color;
        const connectorY = Math.round(shapeCenterY / cell) * cell + 1;
        const lineStart = bounds.maxX + cell;
        const lineEnd = labelX - cell;
        for (let lineX = lineStart; lineX < lineEnd; lineX += cell) {
          const column = Math.round(lineX / cell);
          ctx.globalAlpha = (.46 + hash(column, layerIndex + 1621) * .18) * visibility;
          ctx.fillRect(column * cell + 1, connectorY, cell - 3, cell - 3);
        }
      }

      ctx.textBaseline = 'top';
      ctx.globalAlpha = visibility;
      ctx.fillStyle = heroLabelTitleColor;
      ctx.font = '500 13px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.fillText(layer.label, labelX, labelY, labelWidth);
      ctx.fillStyle = heroLabelSubtitleColor;
      ctx.font = '400 13px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.fillText(layer.detail, labelX, labelY + 24, labelWidth);
      ctx.globalAlpha = .48 * visibility;
      ctx.fillText(liveDataPassLabel, labelX, labelY + 48, labelWidth);
      ctx.restore();
    }

    function toggleLayerShape(layerIndex) {
      const nextLayer = selectedLayer === layerIndex ? null : layerIndex;
      if (nextLayer === null) {
        clickFlowLayer = null;
        hoverFlowLayer = null;
      } else {
        clickFlowLayer = layerIndex;
        clickFlowStarted = animationTime;
      }
      morphFromLayer = selectedLayer;
      morphToLayer = nextLayer;
      morphStarted = reducedMotion ? animationTime - MORPH_DURATION : animationTime;
      selectedLayer = nextLayer;
      if (hoveredLayer === layerIndex) {
        if (nextLayer === layerIndex) tooltip.classList.remove('is-visible');
        else tooltip.textContent = 'Click to view pixel form';
      }
    }

    function deposit(x, y, amount, radius) {
      const centerColumn = x / cell;
      const centerRow = y / cell;
      const reach = Math.ceil(radius * 1.7);
      const divisor = 2 * radius * radius * .2;
      for (let dy = -reach; dy <= reach; dy += 1) {
        for (let dx = -reach; dx <= reach; dx += 1) {
          const column = (centerColumn + dx) | 0;
          const row = (centerRow + dy) | 0;
          if (column < 0 || row < 0 || column >= cols || row >= rows) continue;
          const distanceX = column + .5 - centerColumn;
          const distanceY = row + .5 - centerRow;
          const weight = Math.exp(-(distanceX ** 2 + distanceY ** 2) / divisor);
          if (weight < .02) continue;
          const index = row * cols + column;
          heat[index] = Math.min(1.15, heat[index] + amount * weight);
        }
      }
    }

    function heatAt(x, y) {
      const column = Math.max(0, Math.min(cols - 1, Math.floor(x / cell)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor(y / cell)));
      return heat[row * cols + column] || 0;
    }

    function drawPixel(x, y, alpha = 1, color = heroInkColor) {
      const size = (cell - 2) * (width < 768 ? .8 : 1);
      const inset = (cell - size) / 2;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(x / cell) * cell + inset,
        Math.round(y / cell) * cell + inset,
        size,
        size
      );
    }

    function drawLabelIcon(x, y, layerIndex) {
      const iconSize = 18;
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.scale(iconSize / 24, iconSize / 24);
      ctx.fillStyle = RED_FLOW_COLOR;
      ctx.fill(LABEL_ICON_PATHS[layerIndex], 'evenodd');
      ctx.restore();
    }

    function fillGridBlock(x, y, columns, rows) {
      ctx.fillRect(
        x + 1,
        y + 1,
        columns * cell - 2,
        rows * cell - 2
      );
    }

    function randomGridFlash(time, index, salt) {
      if (reducedMotion) return { alpha: .12, generation: 0 };
      const visibleDuration = .32 + hash(index + salt, 2081) * .34;
      const hiddenDuration = .72 + hash(index + salt, 2083) * 1.1;
      const cycleDuration = visibleDuration + hiddenDuration;
      const shiftedTime = time + hash(index + salt, 2087) * cycleDuration;
      const generation = Math.floor(shiftedTime / cycleDuration);
      const cycleTime = shiftedTime - generation * cycleDuration;
      const progress = cycleTime / visibleDuration;
      return {
        alpha: progress >= 0 && progress <= 1
          ? Math.sin(progress * Math.PI) ** 2 * .2
          : 0,
        generation,
      };
    }

    function easeOutCubic(value) {
      const clamped = Math.max(0, Math.min(1, value));
      return 1 - (1 - clamped) ** 3;
    }

    function entranceAt(layout, y, salt = 0) {
      if (reducedMotion) return 1;
      const span = Math.max(1, layout.stageGap * (DATA.length - 1));
      const verticalProgress = Math.max(0, Math.min(1, (y - layout.topY) / span));
      const threshold = intro * 1.42 - verticalProgress * .92 - hash(salt + 19, 71) * .12;
      return easeOutCubic(threshold / .18);
    }

    function funnelFadeAt(layout, y) {
      const start = layout.heroBottom - vortexControls.fadeDistance;
      const end = layout.heroBottom - cell * 2;
      const progress = Math.max(0, Math.min(1, (y - start) / (end - start)));
      const eased = progress * progress * (3 - 2 * progress);
      return 1 - eased;
    }

    function drawGrid() {
      const gridEntrance = reducedMotion ? 1 : .2 + easeOutCubic(intro * 1.65) * .8;
      const gridGradient = ctx.createLinearGradient(0, 0, 0, height);
      gridGradient.addColorStop(0, heroGridColor);
      gridGradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = gridGradient;
      ctx.globalAlpha = gridEntrance;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += cell) {
        ctx.moveTo(x + .5, 0);
        ctx.lineTo(x + .5, height);
      }
      for (let y = 0; y <= height; y += cell) {
        ctx.moveTo(0, y + .5);
        ctx.lineTo(width, y + .5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawHeroCopyAccents(layout, time) {
      ctx.fillStyle = primary500;
      HERO_COPY_ACCENTS.forEach((strength, index) => {
        const flash = randomGridFlash(time, index, 1831);
        if (flash.alpha <= 0) return;
        const seed = index + flash.generation * 41;
        const maxX = Math.max(cell, layout.visualLeft - cell * 2);
        const maxY = Math.max(layout.visualTop, layout.visualTop + layout.visualHeight - cell);
        const x = Math.round((cell + hash(seed + 1889, 1901) * (maxX - cell)) / cell) * cell;
        const y = Math.round((layout.visualTop + hash(seed + 1913, 1931)
          * (maxY - layout.visualTop)) / cell) * cell;
        ctx.globalAlpha = Math.min(.2, flash.alpha * (.65 + strength));
        fillGridBlock(x, y, 1, 1);
      });
      ctx.globalAlpha = 1;
    }

    const SCAN_TRAIL_ROWS = 8;
    const SCAN_TRANSIT = 0;
    const SCAN_HEAD_ALPHA = .72;
    const SCAN_TRAIL_ALPHA = .56;
    const SCAN_GRID_UNIT = 6;

    const scanRevealTargets = [header, ...copy.children, visual, productHeading].filter(Boolean);
    let headerRevealForced = window.scrollY > 24 || hero.getBoundingClientRect().bottom <= 0;

    function revealHeaderImmediately() {
      if (!header) return;
      headerRevealForced = true;
      header.style.opacity = '1';
      header.style.clipPath = 'none';
      header.style.willChange = 'auto';
    }

    if (headerRevealForced) revealHeaderImmediately();

    function scanState() {
      const scan = (intro - .067) / .933;
      const clamped = Math.max(0, Math.min(1, scan));
      const progress = clamped * clamped * (3 - 2 * clamped);
      return {
        scan,
        progress,
        headY: SCAN_TRANSIT + (scanHeight - SCAN_TRANSIT) * progress
      };
    }

    function syncScanReveal() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      hero.style.setProperty('--hero-scan-edge', scan >= 1 ? '100%' : `${headY}px`);
      const activeRevealTargets = headerRevealForced
        ? scanRevealTargets.filter(element => element !== header)
        : scanRevealTargets;
      if (scan >= 1) {
        hero.classList.add('is-scan-complete');
        activeRevealTargets.forEach(element => {
          element.style.opacity = '1';
          element.style.clipPath = 'none';
          element.style.willChange = 'auto';
        });
        return;
      }
      const lineY = headY;
      const states = activeRevealTargets.map(element => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (lineY - rect.top) / Math.max(1, rect.height)));
        return { element, progress };
      });
      states.forEach(({ element, progress }) => {
        element.style.opacity = progress > 0 ? '1' : '0';
        element.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
      });
    }

    function drawScanTrail() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      if (scan <= 0 || scan >= 1) return;
      const ctx = scanContext;
      ctx.clearRect(0, 0, scanWidth, scanHeight);
      const fadeOut = scan < .9 ? 1 : Math.max(0, 1 - (scan - .9) / .1);
      const headRow = Math.round(headY / SCAN_GRID_UNIT);
      if (headRow < 1) return;
      const firstRow = Math.max(0, headRow - SCAN_TRAIL_ROWS);
      const trailCols = Math.ceil(scanWidth / SCAN_GRID_UNIT) + 1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = STAGE_COLORS[0];
      ctx.globalAlpha = 1;

      for (let r = firstRow; r <= headRow; r += 1) {
        const dist = headRow - r;
        const rowFade = Math.pow(1 - dist / (SCAN_TRAIL_ROWS + 1), 1.12);
        const isHead = dist === 0;
        const maxAlpha = (isHead ? SCAN_HEAD_ALPHA : SCAN_TRAIL_ALPHA) * rowFade * fadeOut;
        if (maxAlpha <= .02) continue;
        const y = r * SCAN_GRID_UNIT + .5;

        let segStart = 0;
        while (segStart < trailCols) {
          const segHash = hash(r * 53, segStart * 31 + dist * 7);
          const segEnd = Math.min(trailCols - 1, segStart + 1 + Math.floor(segHash * 6));
          const stagger = easeOutCubic(Math.min(1, Math.max(0, (scan - segHash * .16) / .45)));
          const broken = !isHead && hash(r * 97, segStart * 23 + dist * 11) < .17;
          const alpha = broken ? 0 : maxAlpha * (.5 + hash(r * 71, segStart * 17) * .5) * stagger;
          if (alpha >= .02) {
            ctx.globalAlpha = Math.min(1, alpha);
            const x0 = segStart * SCAN_GRID_UNIT + .5;
            const x1 = (segEnd + 1) * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
            ctx.stroke();
          }
          segStart = segEnd + 1;
        }

        if (!isHead) {
          const bandBottom = (r + 1) * SCAN_GRID_UNIT + .5;
          for (let c = 0; c < trailCols; c += 1) {
            if (hash(r * 43, c * 7 + dist * 19) < .48) continue;
            const alpha = maxAlpha * (.18 + hash(r * 31, c * 13) * .38);
            if (alpha < .02) continue;
            ctx.globalAlpha = Math.min(1, alpha);
            const x = c * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, bandBottom);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawVortexMouth(layout, funnelOpacity) {
      if (!vortexControls.mouthEnabled) return;
      const particleCount = width < 768
        ? Math.round(vortexControls.mouthCount * .46)
        : Math.round(vortexControls.mouthCount);
      const outerRadius = layout.isDesktopLayout ? width * .51 : layout.maxWidth * .47;
      const innerRadius = outerRadius * .16;
      const mouthY = layout.topY + cell * 4;
      const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
      const rotation = reducedMotion ? 0 : animationTime * vortexControls.mouthSpeed * direction;
      const centerX = layout.isDesktopLayout ? width / 2 : layout.centerX;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      for (let index = 0; index < particleCount; index += 1) {
        const progress = (index + .5) / particleCount;
        const radius = innerRadius + (outerRadius - innerRadius) * Math.sqrt(progress);
        const angle = index * goldenAngle + direction * radius / outerRadius * 2.3 + rotation;
        const depth = (Math.sin(angle) + 1) * .5;
        const density = (.26 + depth * .62) * vortexControls.mouthDensity;
        if (hash(index + 607, 977) > density) continue;
        const x = centerX + Math.cos(angle) * radius * (.76 + depth * .24);
        const y = mouthY + Math.sin(angle) * radius * .18;
        const reveal = entranceAt(layout, y, index + 1049);
        drawPixel(
          x,
          y,
          (.16 + depth * .52) * reveal * funnelOpacity * vortexControls.overallAlpha,
          primary500
        );
      }
    }

    function layerLabelY(layout, layerIndex) {
      const layerProgress = layerIndex === 0 && layout.isDesktopLayout ? .72 : .5;
      return layout.topY + layout.stageGap * (layerIndex + layerProgress)
        + vortexControls.allLabelsY + vortexControls[LABEL_Y_KEYS[layerIndex]];
    }

    function layerAtPoint(layout, x, y) {
      if (!layout.showLayerCards) return null;
      const isInsidePipeline = x >= layout.visualLeft - cell * 2
        && x <= width - 8;
      if (!isInsidePipeline) return null;

      let nearestLayer = null;
      let nearestDistance = Infinity;
      LAYERS.forEach((_, layerIndex) => {
        const distance = Math.abs(y - layerLabelY(layout, layerIndex));
        if (distance < nearestDistance) {
          nearestLayer = layerIndex;
          nearestDistance = distance;
        }
      });
      return nearestDistance <= vortexControls.hoverHeight * .5 ? nearestLayer : null;
    }

    function layerRightEdge(layout, layerIndex, y) {
      const stagePosition = (y - layout.topY) / layout.stageGap;
      return stageTracks[layerIndex + 1].reduce((edge, trackId) => (
        Math.max(edge, pointAtStage(layout, trackId, stagePosition, 0).x)
      ), layout.centerX);
    }

    function layerLabelBoxWidth() {
      ctx.save();
      ctx.font = '500 13px "Geist", "Frex Sans GB VF", sans-serif';
      const titleWidth = Math.max(...LAYERS.map(layer => ctx.measureText(layer.label).width));
      ctx.font = '400 13px "Geist", "Frex Sans GB VF", sans-serif';
      const detailWidth = Math.max(...LAYERS.map(layer => ctx.measureText(layer.detail).width));
      ctx.restore();
      return Math.max(28 + titleWidth, detailWidth);
    }

    function layerLabelBoxX(layout) {
      const groupWidth = layerLabelBoxWidth();
      const safeRight = layout.visualLeft + layout.visualWidth;
      const safeAlignedX = safeRight - groupWidth + 28;
      const minimumGapX = Math.max(...LAYERS.map((_, layerIndex) => {
        const y = layerLabelY(layout, layerIndex);
        return layerRightEdge(layout, layerIndex, y);
      })) + 20 + 28;
      const viewportLimitX = width - 20 - groupWidth + 28;
      return Math.min(viewportLimitX, Math.max(safeAlignedX, minimumGapX));
    }

    function drawLayerOutflows(layout, time, funnelOpacity) {
      if (!layout.showLayerCards || !vortexControls.enabled || vortexControls.count < 1) return;

      const labelX = layerLabelBoxX(layout);
      LAYERS.forEach((_, layerIndex) => {
        const y = layerLabelY(layout, layerIndex);
        const rightEdge = layerRightEdge(layout, layerIndex, y);
        const sourceX = Math.min(labelX - cell * 12, rightEdge + cell);
        const endX = labelX - cell * 2.5;
        const visibility = layerCardVisibility(layerIndex, time) * funnelFadeAt(layout, y) * funnelOpacity;

        const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
        for (let index = 0; index < Math.round(vortexControls.count); index += 1) {
          const offset = hash(index + layerIndex * 37, 1087);
          const progress = reducedMotion
            ? offset
            : (time * vortexControls.speed * (1 + layerIndex * .04) + offset) % 1;
          const phase = index * 1.73
            + direction * (progress * Math.PI * 2 * vortexControls.turns + layerIndex * .9);
          const spread = cell * (vortexControls.baseSpread + progress * vortexControls.spreadGrowth);
          const x = sourceX + (endX - sourceX) * progress + Math.cos(phase) * spread;
          const particleY = y + Math.sin(phase) * spread * .72;
          const envelope = Math.sin(progress * Math.PI);
          drawPixel(
            x,
            particleY,
            envelope * (.5 + hash(index + 733, layerIndex + 1103) * .5)
              * vortexControls.alpha * visibility,
            primary500
          );
        }
      });
    }

    // The orange lines are not drawn separately: they are the vortex's own
    // stream particles. Each line enters on a stable track, then progressively
    // steers across neighbouring tracks toward its configured exit angle. A
    // window of stages travels down that path, lighting the particles inside
    // it orange at full density.
    function selectRedFlowTrack(index, rotationPhase) {
      const trackCount = unitCounts[0];
      const direction = vortexControls.direction === 'counterclockwise' ? -1 : 1;
      const rotation = reducedMotion ? 0 : rotationPhase;
      const targetAngle = vortexControls[RED_FLOW_TRAILS[index].startKey] * Math.PI / 180;
      const angleAtMouth = trackId => trackId / trackCount * Math.PI * 2 + direction * rotation;
      const angularDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
      let best = stageTracks[0][0];
      let bestDistance = Infinity;
      stageTracks[0].forEach(trackId => {
        const distance = angularDistance(angleAtMouth(trackId), targetAngle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = trackId;
        }
      });
      return best;
    }

    // Per-frame state of the lines: for each line the track it rides and the
    // stage window [tail, head] that is currently lit. Every line loops on
    // its own period of 5 × interval and starts `interval` after the previous
    // one, so a new line enters while the previous ones are still wrapping.
    // Keeping one entry per line also lets multiple lines share an entry track
    // while steering toward different exits.
    function redFlowWindowsAt(time) {
      if (redFlowStartedAt === null) redFlowStartedAt = time;
      const interval = Math.max(.3, vortexControls.redFlowInterval);
      const period = interval * RED_FLOW_TRAILS.length;
      const activeDuration = Math.min(period, Math.max(.6, vortexControls.redFlowDuration));
      const appearanceDelay = Math.min(10, Math.max(0, vortexControls.redFlowDelay));
      const finalStage = DATA.length - 1;
      const elapsed = time - redFlowStartedAt - appearanceDelay;

      const windows = [];
      RED_FLOW_TRAILS.forEach((trail, index) => {
        const lineDelay = index * interval + vortexControls[trail.delayKey];
        const lineTime = elapsed - lineDelay;
        if (!reducedMotion && lineTime < 0) return;
        const cycleIndex = Math.floor(lineTime / period);
        const localTime = lineTime - cycleIndex * period;
        // The head runs from the mouth to one trail length past the base so
        // the tail leaves the vortex as well.
        const travel = finalStage + trail.length;
        const head = (() => {
          if (reducedMotion) return travel * (.45 + index * .08);
          if (localTime > activeDuration) return null;
          return travel * (localTime / activeDuration);
        })();
        if (head === null) return;
        // The entry track is chosen once per cycle so the mouth does not hop
        // while the vortex rotates underneath.
        const cycleStart = redFlowStartedAt + appearanceDelay + lineDelay + cycleIndex * period;
        const cycleRotation = reducedMotion ? 0 : cycleStart * vortexControls.rotationSpeed;
        const trackId = selectRedFlowTrack(index, cycleRotation);
        const endAngle = vortexControls[trail.endKey] * Math.PI / 180;
        windows.push({
          lineTrackId: trackId,
          head,
          tail: head - trail.length,
          length: trail.length,
          endAngle
        });
      });
      return windows;
    }

    function drawDataStream(layout, time, funnelOpacity = 1) {
      const trailAlpha = .48 + (SETTINGS.trailDecay - .75) / .22 * .08;

      ctx.save();
      ctx.font = '600 9px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.textBaseline = 'bottom';
      drawVortexMouth(layout, funnelOpacity);

      const flowWindows = redFlowWindowsAt(time);
      const silhouetteSoftness = Math.max(.02, vortexControls.redFlowSilhouetteFade);
      const mouthOpen = Math.max(.05, vortexControls.redFlowMouthOpen);
      const baseOpen = vortexControls.redFlowBaseOpen;
      const bandHalfWidth = cell * Math.max(.3, vortexControls.redFlowLineWidth);
      const trackCount = unitCounts[0];
      const totalStages = DATA.length - 1;
      const twistPerStage = vortexControls.twistPerStage;
      const middleTwist = vortexControls.middleTwist;
      const baseTwist = vortexControls.baseTwist;
      const middleStart = 1.15;
      const middleEnd = LAYERS.length + .15;
      const baseSpan = DATA.length - 1 - middleEnd;
      const turnCenter = Math.max(.2, Math.min(.9, vortexControls.redFlowTurnPosition));
      const turnStart = Math.max(0, turnCenter - .2);
      const turnEnd = Math.min(1, turnCenter + .2);
      const turnProgressAt = stagePosition => {
        const linear = Math.max(0, Math.min(1,
          (stagePosition / totalStages - turnStart) / (turnEnd - turnStart)
        ));
        return linear * linear * (3 - 2 * linear);
      };
      const linePaths = [];
      flowWindows.forEach(flowWindow => {
        const { lineTrackId } = flowWindow;
        const naturalEndAngle = pointAtStage(layout, lineTrackId, totalStages).angle;
        linePaths.push({
          flowWindow,
          lineTrackId,
          exitTurn: wrapAngle(flowWindow.endAngle - naturalEndAngle)
        });
      });
      const lineOffsetsFor = trackId => {
        return linePaths.flatMap(({ flowWindow, lineTrackId, exitTurn }) => {
          const phaseOffset = wrapAngle((trackId - lineTrackId) / trackCount * Math.PI * 2);
          const nearestTurn = Math.max(
            Math.min(0, exitTurn),
            Math.min(Math.max(0, exitTurn), phaseOffset)
          );
          if (Math.abs(phaseOffset - nearestTurn) > .8) return [];
          return [{ flowWindow, exitTurn, phaseOffset }];
        });
      };
      // Perpendicular distance (in surface pixels) from a particle to the
      // line's spiral path at the particle's stage. The path advances
      // radius·dθ/ds around and stageGap down per stage; the angular offset
      // is projected onto the normal of that direction.
      const distanceToLine = (point, angularOffset) => {
        const middleLinear = Math.max(0, Math.min(1,
          (point.stagePosition - middleStart) / (middleEnd - middleStart)
        ));
        const baseLinear = Math.max(0, Math.min(1, (point.stagePosition - middleEnd) / baseSpan));
        const twistRate = twistPerStage
          + middleTwist * 6 * middleLinear * (1 - middleLinear) / (middleEnd - middleStart)
          + baseTwist * 6 * baseLinear * (1 - baseLinear) / baseSpan;
        const surfaceRadius = point.radius * point.shell;
        const arcOffset = surfaceRadius * angularOffset;
        const arcPerStage = surfaceRadius * twistRate;
        return arcOffset * layout.stageGap / Math.hypot(arcPerStage, layout.stageGap);
      };

      stageTracks[0].forEach(trackId => {
        const lineOffsets = lineOffsetsFor(trackId);
        const sampleCount = Math.max(24, Math.round(layout.stageGap * totalStages / cell));
        const flowOffset = reducedMotion
          ? 0
          : (time * vortexControls.flowSpeed * (
            1 + (hash(trackId + 811, 1129) - .5) * 2 * vortexControls.speedVariation
          )) % 1;
        const gapChance = .035 + hash(trackId + 83, 271) * .065;
        for (let sample = 0; sample < sampleCount; sample += 1) {
          const streamProgress = (sample / sampleCount + flowOffset) % 1;
          const point = pointAtStage(layout, trackId, streamProgress * totalStages);
          const destinationStage = Math.min(DATA.length - 1, Math.floor(point.stagePosition) + 1);
          if (!stageTrackSets[destinationStage].has(trackId)) continue;

          // Orange line: this particle sits within one cell of a line's path
          // and inside that line's lit stage window. It is only lit on the
          // near side of the funnel (the far side stays green, occluded),
          // except at the open mouth where the back rim is visible for the
          // first stage or so. Lit particles ignore the random gap and
          // density gates: the line is the texture with its timing changed.
          let lineAlpha = 0;
          const turnProgress = turnProgressAt(point.stagePosition);
          lineOffsets.forEach(({ flowWindow, exitTurn, phaseOffset }) => {
            if (point.stagePosition < flowWindow.tail || point.stagePosition > flowWindow.head) return;
            const angularOffset = Math.abs(wrapAngle(
              phaseOffset - exitTurn * turnProgress
            ));
            const bandDistance = distanceToLine(point, angularOffset) / bandHalfWidth;
            if (bandDistance >= 1) return;
            const bandWeight = 1 - bandDistance ** 3;
            const frontVisibility = easeOutCubic((point.depth - .42) / silhouetteSoftness);
            // The funnel opens upward at both ends, so the far wall of the
            // mouth and of the base flare is seen from above: the line stays
            // visible there. Only the near-vertical middle hides its back.
            const mouthReveal = 1 - easeOutCubic(point.stagePosition / mouthOpen);
            const baseReveal = easeOutCubic((point.stagePosition - baseOpen) / .8);
            const tailFade = easeOutCubic(
              (point.stagePosition - flowWindow.tail) / Math.max(.2, flowWindow.length * .25)
            );
            const headFade = easeOutCubic((flowWindow.head - point.stagePosition) / .3);
            lineAlpha = Math.max(
              lineAlpha,
              Math.max(frontVisibility, mouthReveal, baseReveal) * tailFade * headFade * bandWeight
            );
          });
          // A square is either green or coral, never a blend of the two (the
          // mix reads as brown). Partial lineAlpha instead decides how many
          // squares of the band have switched, so edges dissolve pixel by
          // pixel like the rest of the texture.
          const inLine = lineAlpha > .001
            && hash(trackId * 173 + sample, 449) < lineAlpha;
          if (!inLine && hash(trackId * 97 + sample, 293) < gapChance) continue;
          const spiralRidge = ((Math.sin(
            point.angle * vortexControls.ridgeFrequency + point.stagePosition * .72
          ) + 1) * .5) ** 2;
          const middleDistance = (point.stagePosition - 2.75) / 1.45;
          const middleEnvelope = Math.exp(-(middleDistance ** 2));
          const middleRidge = spiralRidge ** 2 * middleEnvelope * vortexControls.middleLayering;
          const surfaceDensity = (.08 + point.depth * vortexControls.depthDensity
            + spiralRidge * vortexControls.ridgeStrength + middleRidge
            + (1 - point.shell) * .04)
            * vortexControls.streamDensity;
          const passesDensity = hash(trackId * 131 + sample, 337) <= surfaceDensity;
          if (!passesDensity && !inLine) continue;
          const reveal = entranceAt(layout, point.y, trackId + sample);
          const commonAlpha = reveal * funnelOpacity * funnelFadeAt(layout, point.y)
            * vortexControls.overallAlpha;
          if (inLine) {
            drawPixel(
              point.x,
              point.y,
              vortexControls.redFlowLineAlpha * (.82 + point.depth * .18) * commonAlpha,
              RED_FLOW_COLOR
            );
            continue;
          }
          const surfaceAlpha = .48 + point.depth * vortexControls.depthAlpha
            + spiralRidge * .34 + middleRidge * .5;
          const particleAlpha = trailAlpha * (.55 + hash(trackId + 211, sample + 419) * .72);
          // Embers: a minority of particles in the ridge troughs, weighted to
          // the back of the funnel, turn coral so the shadow side reads as a
          // faint flame instead of flat green. Same coral as the lines, drawn
          // at least as solid as a green square, so it never muddies to brown.
          const shadow = (1 - spiralRidge) ** 2 * (.35 + (1 - point.depth) * .65);
          const isEmber = hash(trackId * 151 + sample, 401) < shadow * vortexControls.emberAmount;
          drawPixel(
            point.x,
            point.y,
            particleAlpha * surfaceAlpha * commonAlpha * (isEmber ? vortexControls.emberAlpha : 1),
            isEmber ? RED_FLOW_COLOR : primary500
          );
        }
      });

      drawLayerOutflows(layout, time, funnelOpacity);

      const layerLabelX = layout.showLayerCards ? layerLabelBoxX(layout) : 0;
      if (layout.showLayerCards) LAYERS.forEach((layer, layerIndex) => {
        const y = layerLabelY(layout, layerIndex);
        const isSelected = selectedLayer === layerIndex;
        const isActive = hoveredLayer === layerIndex || isSelected;
        const labelReveal = entranceAt(layout, y, layerIndex + 701);
        const cardVisibility = layerCardVisibility(layerIndex, time);
        const layerFade = funnelFadeAt(layout, y);
        const labelOffsetX = (1 - cardVisibility) * cell * 1.8;

        const markerX = layerLabelX + labelOffsetX;
        ctx.globalAlpha = (isSelected ? 1 : isActive ? .9 : .74) * labelReveal * cardVisibility * layerFade;
        drawLabelIcon(markerX - 28, y - 10, layerIndex);

        const titleX = markerX;
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = (isActive ? 1 : .88) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = isSelected ? primary500 : heroLabelTitleColor;
        ctx.font = '500 13px "Geist", "Frex Sans GB VF", sans-serif';
        ctx.fillText(layer.label, titleX, y + 5);
        ctx.globalAlpha = (isActive ? .76 : .68) * labelReveal * cardVisibility * layerFade;
        ctx.fillStyle = heroLabelSubtitleColor;
        ctx.font = '400 13px "Geist", "Frex Sans GB VF", sans-serif';
        ctx.fillText(layer.detail, markerX - 28, y + 31);
      });
      drawShapeAnnotation(layout, time);
      ctx.restore();
    }

    function drawGridFlowPass(layout, time, layerIndex, started) {
      if (layerIndex === null) return false;
      const centerY = layerLabelY(layout, layerIndex);
      const top = centerY - vortexControls.hoverHeight * .5;
      const bottom = centerY + vortexControls.hoverHeight * .5;
      const firstRow = Math.ceil(top / cell);
      const lastRow = Math.floor(bottom / cell);
      const centerColumn = layout.centerX / cell;
      const maxColumnDistance = Math.max(centerColumn, cols - centerColumn);
      const age = time - started;
      const duration = 1.85;

      if (reducedMotion && hoveredLayer === null) return false;
      if (!reducedMotion && (age < 0 || age > duration)) return false;
      ctx.fillStyle = primary500;

      for (let row = firstRow; row <= lastRow; row += 1) {
        for (let column = 0; column < cols; column += 1) {
          const distance = Math.abs(column + .5 - centerColumn) / maxColumnDistance;
          const rowDrift = Math.sin(row * .82 + column * .16) * .045
            + Math.sin(row * 1.71 - column * .08) * .025;
          const cellJitter = (hash(column + layerIndex * 37, row + 719) - .5) * .11;
          const delay = distance * .68 + rowDrift + cellJitter;
          let envelope = .58;

          if (!reducedMotion) {
            const localAge = age - delay;
            if (localAge <= 0) continue;
            const enter = easeOutCubic(localAge / .16);
            const fade = 1 - easeOutCubic((localAge - .38) / .62);
            envelope = enter * fade;
            if (envelope <= .01) continue;
          }

          const variation = .62 + hash(column + 811, row + layerIndex * 53) * .38;
          ctx.globalAlpha = envelope * variation * .2;
          ctx.fillRect(column * cell + 1, row * cell + 1, cell - 3, cell - 3);
        }
      }
      ctx.globalAlpha = 1;
      return true;
    }

    function drawHoverGridFlow(layout, time) {
      if (clickFlowLayer !== null) {
        if (drawGridFlowPass(layout, time, clickFlowLayer, clickFlowStarted)) return;
        clickFlowLayer = null;
      }
      drawGridFlowPass(layout, time, hoverFlowLayer, hoverFlowStarted);
    }

    function updateHoveredTrack(x, y, clientX, clientY) {
      const layout = buildLayout();
      const layerIndex = layerAtPoint(layout, x, y);
      const visibleLayer = selectedLayer === null || selectedLayer === layerIndex;
      const nextHoveredLayer = layerIndex !== null && visibleLayer ? layerIndex : null;
      if (nextHoveredLayer !== null && nextHoveredLayer !== hoveredLayer) {
        hoverFlowLayer = nextHoveredLayer;
        hoverFlowStarted = animationTime;
      }
      hoveredLayer = nextHoveredLayer;
      hero.classList.toggle('is-data-layer-hovered', hoveredLayer !== null && hoveredLayer !== 0);

      hoveredTrack = null;
      if (hoveredLayer === null) {
        tooltip.classList.remove('is-visible');
        return;
      }
      if (selectedLayer === hoveredLayer) {
        tooltip.classList.remove('is-visible');
        return;
      }
      tooltip.textContent = 'Click to view pixel form';
      tooltip.style.left = `${Math.min(innerWidth - 240, clientX)}px`;
      tooltip.style.top = `${Math.min(innerHeight - 70, clientY)}px`;
      tooltip.classList.add('is-visible');
    }

    function frame(milliseconds) {
      frameId = 0;
      if (!active || !visible || document.hidden) return;
      const delta = lastFrame ? Math.min(.04, (milliseconds - lastFrame) / 1000) : 0;
      lastFrame = milliseconds;
      intro = Math.min(1, intro + delta / 1.2);
      syncScanReveal();
      if (!reducedMotion) animationTime += delta;
      const time = animationTime;
      const layout = buildLayout();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = heroPaperColor;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      drawGrid();
      drawHeroCopyAccents(layout, animationTime);
      drawScanTrail();
      drawHoverGridFlow(layout, time);
      const funnelOpacity = funnelOpacityAt(animationTime);
      drawModeMorph(layout, animationTime);
      drawDataStream(layout, time, funnelOpacity);
      ctx.globalAlpha = 1;
      ctx.restore();
      const decay = reducedMotion ? .84 : Math.pow(SETTINGS.trailDecay, Math.max(.2, delta * 60));
      for (let index = 0; index < heat.length; index += 1) {
        heat[index] *= decay;
        if (heat[index] < .003) heat[index] = 0;
      }
      frameId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (!active || !visible || document.hidden || frameId) return;
      lastFrame = 0;
      frameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    hero.addEventListener('pointermove', event => {
      if (!finePointer) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (previousX >= 0) {
        const dx = pointerX - previousX;
        const dy = pointerY - previousY;
        const steps = Math.max(1, Math.min(30, Math.round(Math.hypot(dx, dy) / (cell * .75))));
        for (let index = 1; index <= steps; index += 1) {
          const progress = index / steps;
          deposit(previousX + dx * progress, previousY + dy * progress, SETTINGS.interactionStrength, SETTINGS.brushRadius);
        }
      }
      previousX = pointerX;
      previousY = pointerY;
      updateHoveredTrack(pointerX, pointerY, event.clientX, event.clientY);
    }, { signal });

    hero.addEventListener('pointerleave', () => {
      hoveredTrack = null;
      hoveredLayer = null;
      hoverFlowLayer = null;
      hero.classList.remove('is-data-layer-hovered');
      pointerX = -1;
      pointerY = -1;
      previousX = -1;
      previousY = -1;
      tooltip.classList.remove('is-visible');
    }, { signal });

    hero.addEventListener('pointerdown', event => {
      if (event.target.closest?.('a, button')) return;
      const rect = canvas.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const layout = buildLayout();
      const clickedLayer = layerAtPoint(layout, localX, localY);
      if (clickedLayer !== null) {
        toggleLayerShape(selectedLayer !== null ? selectedLayer : clickedLayer);
      }
    }, { signal });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    resizeObserver.observe(visual);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) startAnimation();
      else {
        revealHeaderImmediately();
        intro = 1;
        syncScanReveal();
        stopAnimation();
        tooltip.classList.remove('is-visible');
      }
    }, { threshold: 0 });
    intersectionObserver.observe(hero);

    applyCanvasSize();
    syncScanReveal();
    startAnimation();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    }, { signal });
    window.addEventListener('resize', resize, { signal });
    window.addEventListener('pagehide', stopAnimation, { once: true, signal });
    cleanups.push(() => {
      active = false;
      controller.abort();
      stopAnimation();
      cancelAnimationFrame(resizeFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.classList.remove('is-data-layer-hovered', 'is-scan-complete');
      tooltip.classList.remove('is-visible');
      hero.style.removeProperty('--hero-scan-edge');
      scanRevealTargets.forEach(element => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('clip-path');
        element.style.removeProperty('will-change');
      });
    });
  }

function initializeFormatGlobe(root, cleanups) {
    'use strict';

    const canvas = root.querySelector('[data-format-globe]');
    const stage = canvas?.closest('.format-orbit-stage--thread-globe');
    if (!canvas || !stage) return;
    canvas.dataset.formatGlobeOwned = 'true';

    const context = canvas.getContext('2d');
    const layout = stage.closest('.format-orbit-layout');
    const currentColor = (property, fallback) => getComputedStyle(document.documentElement)
      .getPropertyValue(property).trim() || fallback;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ringRotations = [
      [0, 0, 0],
      [0.92, 0.10, 0.56],
      [-0.78, 0.38, -0.68],
      [0.22, 1.05, 1.16]
    ];
    const movingDashRingIndex = 2;
    const formatLabels = ['.docx', '.pdf', '.jpg', '.pptx', '.xlsx', '.csv', '.png', '.md', '.json', '.txt'];
    const formatIconPaths = {
      '.csv': '/assets/file-icons/table.svg',
      '.docx': '/assets/file-icons/word.svg',
      '.jpg': '/assets/file-icons/image.svg',
      '.json': '/assets/file-icons/json.svg',
      '.md': '/assets/file-icons/markdown.svg',
      '.pdf': '/assets/file-icons/pdf.svg',
      '.png': '/assets/file-icons/image.svg',
      '.pptx': '/assets/file-icons/powerpoint.svg',
      '.txt': '/assets/file-icons/document.svg',
      '.xlsx': '/assets/file-icons/table.svg'
    };
    const particles = Array.from({ length: 10 }, (_, index) => ({
      ring: index % ringRotations.length,
      phase: (index * 0.61803398875) % 1,
      speed: 0.012 + (index % 4) * 0.003,
      radius: index % 5 === 0 ? 3.4 : 2.1,
      label: formatLabels[index]
    }));
    const iconCssSize = 16;
    const iconDecodeSize = 64;
    const formatIconImages = new Map();
    Object.entries(formatIconPaths).forEach(([label, source]) => {
      const image = new Image();
      image.decoding = 'async';
      formatIconImages.set(label, image);
      fetch(source)
        .then(response => response.ok ? response.text() : Promise.reject(response.status))
        .then(svg => {
          const sized = /<svg\b[^>]*\bwidth=/.test(svg)
            ? svg
            : svg.replace(/<svg\b/, `<svg width="${iconDecodeSize}" height="${iconDecodeSize}"`);
          image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
        })
        .catch(() => {
          image.src = source;
        });
    });
    const whiteIconCanvas = document.createElement('canvas');
    const whiteIconContext = whiteIconCanvas.getContext('2d');

    function formatIconPixelSize() {
      return Math.max(1, Math.round(iconCssSize * Math.min(devicePixelRatio || 1, 2)));
    }

    function syncWhiteIconCanvas() {
      const pixelSize = formatIconPixelSize();
      if (whiteIconCanvas.width !== pixelSize || whiteIconCanvas.height !== pixelSize) {
        whiteIconCanvas.width = pixelSize;
        whiteIconCanvas.height = pixelSize;
      }
      return pixelSize;
    }

    let width = 1;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let pointerLocalX = 0;
    let pointerLocalY = 0;
    let pointerInside = false;
    let visible = false;
    let frameId = 0;
    let animationElapsed = 0;
    let lastFrameTime = null;
    let introStartedAt = reducedMotion ? 0 : null;
    let introComplete = reducedMotion;
    const controller = new AbortController();
    const { signal } = controller;
    let active = true;
    const introRingDuration = 800;
    const introRingStagger = 140;
    const autoLabelInterval = 10000;
    const labelFadeDuration = 800;
    let activeLabelIndex = 0;
    let outgoingLabelIndex = null;
    let labelTransitionStartedAt = 0;
    let previousHoveredParticleIndex = null;
    let autoLabelTimer = 0;

    if (reducedMotion) layout?.classList.add('is-format-intro-visible');

    function nextLabelIndex(currentIndex) {
      return (currentIndex + 1) % particles.length;
    }

    function activateLabel(nextIndex, now = animationElapsed) {
      if (nextIndex === activeLabelIndex) return;
      outgoingLabelIndex = reducedMotion ? null : activeLabelIndex;
      activeLabelIndex = nextIndex;
      labelTransitionStartedAt = now;
    }

    function scheduleAutoLabel() {
      clearTimeout(autoLabelTimer);
      if (!active || !visible || document.hidden) return;
      autoLabelTimer = window.setTimeout(() => {
        activateLabel(nextLabelIndex(activeLabelIndex), animationElapsed);
        draw(reducedMotion ? 0 : animationElapsed, animationElapsed);
        scheduleAutoLabel();
      }, autoLabelInterval);
    }

    function easeInOutSine(progress) {
      return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function getRingIntroState(ringIndex, now) {
      if (introComplete || reducedMotion) return { reveal: 1, headOpacity: 0 };
      if (introStartedAt === null) return { reveal: 0, headOpacity: 0 };
      const raw = Math.max(0, Math.min(1, (
        now - introStartedAt - ringIndex * introRingStagger
      ) / introRingDuration));
      return {
        reveal: easeInOutSine(raw),
        headOpacity: raw > 0.82 ? Math.max(0, (1 - raw) / 0.18) : 1
      };
    }

    function colorWithAlpha(color, alpha) {
      const [red, green, blue] = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function formatBaseColor() {
      const rootStyle = getComputedStyle(document.documentElement);
      const property = document.documentElement.dataset.theme === 'dark'
        ? '--md-sys-color-primary'
        : '--mineral-green-500';
      const color = rootStyle.getPropertyValue(property).trim();
      return /^#[0-9a-f]{6}$/i.test(color) ? color : '#19A88B';
    }

    function formatFocusColor() {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--coral-signal-500').trim();
      return /^#[0-9a-f]{6}$/i.test(color) ? color : '#FF634A';
    }

    function formatBaseColorWithAlpha(alpha) {
      return colorWithAlpha(formatBaseColor(), alpha);
    }

    function formatNeutralColorWithAlpha(alpha) {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--black-100').trim();
      const mappedAlpha = document.documentElement.dataset.theme === 'dark'
        ? Math.min(1, 0.16 + alpha * 1.4)
        : alpha;
      return colorWithAlpha(/^#[0-9a-f]{6}$/i.test(color) ? color : '#000000', mappedAlpha);
    }

    function rotate(point, rotation) {
      let [x, y, z] = point;
      const [rx, ry, rz] = rotation;
      let cosine = Math.cos(rx);
      let sine = Math.sin(rx);
      [y, z] = [y * cosine - z * sine, y * sine + z * cosine];
      cosine = Math.cos(ry);
      sine = Math.sin(ry);
      [x, z] = [x * cosine + z * sine, -x * sine + z * cosine];
      cosine = Math.cos(rz);
      sine = Math.sin(rz);
      [x, y] = [x * cosine - y * sine, x * sine + y * cosine];
      return [x, y, z];
    }

    function pointOnRing(ringIndex, angle, elapsed) {
      let point = [Math.cos(angle), Math.sin(angle), 0];
      if (ringIndex === 0) return point;
      point = rotate(point, ringRotations[ringIndex]);
      point = rotate(point, [tiltX, elapsed * 0.00008 + tiltY, 0]);
      return point;
    }

    function project(point, radius) {
      const perspective = 1 + point[2] * 0.08;
      return {
        x: width * 0.5 + point[0] * radius * perspective,
        y: height * 0.5 + point[1] * radius * perspective,
        z: point[2]
      };
    }

    function drawTraceHead(ringIndex, ringRadius, reveal, opacity, elapsed, segments, color = formatBaseColor()) {
      if (reveal <= 0 || opacity <= 0) return;
      const tailStart = Math.max(0, reveal - 0.16);
      const firstSegment = Math.floor(tailStart * segments);
      const lastSegment = Math.ceil(reveal * segments);
      const tailLength = Math.max(0.001, reveal - tailStart);

      context.save();
      context.shadowColor = colorWithAlpha(color, 0.55);
      context.shadowBlur = 5;
      for (let index = firstSegment; index < lastSegment; index += 1) {
        const start = Math.max(index / segments, tailStart);
        const end = Math.min((index + 1) / segments, reveal);
        if (end <= start) continue;
        const strength = Math.max(0, Math.min(1, (end - tailStart) / tailLength));
        const pointA = project(pointOnRing(ringIndex, start * Math.PI * 2, elapsed), ringRadius);
        const pointB = project(pointOnRing(ringIndex, end * Math.PI * 2, elapsed), ringRadius);
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.lineWidth = 1 + strength * 1.1;
        context.strokeStyle = colorWithAlpha(color, (0.12 + strength * 0.88) * opacity);
        context.stroke();
      }
      context.restore();
    }

    function draw(elapsed, now = animationElapsed) {
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.42;
      const radiusForRing = ringIndex => ringIndex === 0 ? radius : radius * 1.06;
      const segments = 180;
      const ringIntroStates = ringRotations.map((_, ringIndex) => getRingIntroState(ringIndex, now));
      const focusedRingIndex = particles[activeLabelIndex]?.ring;

      if (!introComplete && ringIntroStates.every(state => state.reveal >= 1)) {
        introComplete = true;
      }

      ringRotations.forEach((_, ringIndex) => {
        const ringRadius = radiusForRing(ringIndex);
        const introState = ringIntroStates[ringIndex];
        const isFocusedRing = ringIndex === focusedRingIndex;
        if (introState.reveal <= 0) return;
        if (ringIndex === movingDashRingIndex) {
          context.save();
          context.beginPath();
          const visibleSegments = Math.ceil(segments * introState.reveal);
          for (let index = 0; index <= visibleSegments; index += 1) {
            const angle = Math.min(index / segments, introState.reveal) * Math.PI * 2;
            const point = project(pointOnRing(ringIndex, angle, elapsed), ringRadius);
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
          context.setLineDash([7, 5]);
          context.lineDashOffset = reducedMotion ? 0 : -(elapsed * 0.028) % 12;
          context.lineWidth = 1.1;
          context.strokeStyle = isFocusedRing
            ? colorWithAlpha(formatFocusColor(), 0.86)
            : formatBaseColorWithAlpha(0.78);
          context.stroke();
          context.restore();
          drawTraceHead(
            ringIndex,
            ringRadius,
            introState.reveal,
            introState.headOpacity,
            elapsed,
            segments,
            isFocusedRing ? formatFocusColor() : formatBaseColor()
          );
          return;
        }

        const visibleSegments = Math.ceil(segments * introState.reveal);
        for (let index = 0; index < visibleSegments; index += 1) {
          const angleA = index / segments * Math.PI * 2;
          const angleB = Math.min((index + 1) / segments, introState.reveal) * Math.PI * 2;
          const pointA = project(pointOnRing(ringIndex, angleA, elapsed), ringRadius);
          const pointB = project(pointOnRing(ringIndex, angleB, elapsed), ringRadius);
          const depthAlpha = 0.22 + (pointA.z + 1) * 0.16;

          context.beginPath();
          context.moveTo(pointA.x, pointA.y);
          context.lineTo(pointB.x, pointB.y);
          context.lineWidth = isFocusedRing ? 1.25 : 0.75;
          context.strokeStyle = isFocusedRing
            ? colorWithAlpha(formatFocusColor(), 0.48 + depthAlpha * 0.72)
            : formatNeutralColorWithAlpha(depthAlpha);
          context.stroke();
        }
        drawTraceHead(
          ringIndex,
          ringRadius,
          introState.reveal,
          introState.headOpacity,
          elapsed,
          segments,
          isFocusedRing ? formatFocusColor() : formatBaseColor()
        );
      });

      const particlePoints = particles.map((particle, index) => {
        const phase = reducedMotion
          ? particle.phase
          : (particle.phase + elapsed * 0.001 * particle.speed) % 1;
        const point = pointOnRing(particle.ring, phase * Math.PI * 2, elapsed);
        const introAlpha = Math.max(0, Math.min(1, (ringIntroStates[particle.ring].reveal - 0.72) / 0.28));
        return { ...project(point, radiusForRing(particle.ring)), ...particle, index, introAlpha };
      }).sort((a, b) => a.z - b.z);

      const hoveredParticle = pointerInside
        ? particlePoints.reduce((closest, particle) => {
            if (particle.introAlpha < 0.9) return closest;
            const distance = Math.hypot(particle.x - pointerLocalX, particle.y - pointerLocalY);
            if (distance > 12 || (closest && distance >= closest.distance)) return closest;
            return { particle, distance };
          }, null)?.particle
        : null;

      const hoveredParticleIndex = hoveredParticle?.index ?? null;
      if (hoveredParticleIndex !== previousHoveredParticleIndex) {
        previousHoveredParticleIndex = hoveredParticleIndex;
        if (hoveredParticleIndex !== null) {
          activateLabel(hoveredParticleIndex, now);
          scheduleAutoLabel();
        }
      }

      particlePoints.forEach(particle => {
        if (particle.introAlpha <= 0) return;
        const isHovered = hoveredParticle?.index === particle.index;
        const isFocused = particle.index === activeLabelIndex;
        const isColored = particle.index === 0 || particle.index === 5;
        context.beginPath();
        context.arc(particle.x, particle.y, isHovered || isFocused ? 4.8 : particle.radius, 0, Math.PI * 2);
        context.fillStyle = isFocused
          ? colorWithAlpha(formatFocusColor(), (0.72 + (particle.z + 1) * 0.14) * particle.introAlpha)
          : isHovered || isColored
          ? colorWithAlpha(formatBaseColor(), (0.62 + (particle.z + 1) * 0.16) * particle.introAlpha)
          : formatNeutralColorWithAlpha((0.22 + (particle.z + 1) * 0.20) * particle.introAlpha);
        context.fill();
      });

      const transitionRaw = outgoingLabelIndex === null
        ? 1
        : Math.max(0, Math.min(1, (now - labelTransitionStartedAt) / labelFadeDuration));
      const transitionProgress = easeInOutSine(transitionRaw);
      const activeLabelParticle = particlePoints.find(
        particle => particle.index === activeLabelIndex && particle.introAlpha >= 0.9
      );
      const outgoingLabelParticle = outgoingLabelIndex === null
        ? null
        : particlePoints.find(particle => particle.index === outgoingLabelIndex && particle.introAlpha >= 0.9);

      function drawLabel(particle, opacity) {
        if (!particle || opacity <= 0) return;
        context.save();
        context.globalAlpha = opacity;
        context.font = '500 15px "Geist", "Frex Sans GB VF", sans-serif';
        context.textBaseline = 'middle';
        const textWidth = context.measureText(particle.label).width;
        const labelWidth = textWidth + 36;
        const preferredX = particle.x + 10;
        const labelX = preferredX + labelWidth > width - 4
          ? particle.x - labelWidth - 10
          : preferredX;
        const labelY = Math.max(4, Math.min(height - 28, particle.y - 12));
        const labelColor = formatFocusColor();
        context.fillStyle = labelColor;
        context.fillRect(labelX, labelY, labelWidth, 24);
        const frameX = labelX - 2;
        const frameY = labelY - 2;
        const frameWidth = labelWidth + 4;
        const frameHeight = 28;
        const cornerLength = 7;
        context.beginPath();
        context.moveTo(frameX + cornerLength, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + cornerLength);
        context.moveTo(frameX + cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - cornerLength);
        context.strokeStyle = labelColor;
        context.lineWidth = 1;
        context.stroke();
        const icon = formatIconImages.get(particle.label);
        if (whiteIconContext && icon?.complete && icon.naturalWidth > 0) {
          const pixelSize = syncWhiteIconCanvas();
          const pixelRatio = Math.min(devicePixelRatio || 1, 2);
          whiteIconContext.imageSmoothingEnabled = true;
          whiteIconContext.imageSmoothingQuality = 'high';
          whiteIconContext.clearRect(0, 0, pixelSize, pixelSize);
          whiteIconContext.globalCompositeOperation = 'source-over';
          whiteIconContext.drawImage(icon, 0, 0, pixelSize, pixelSize);
          whiteIconContext.globalCompositeOperation = 'source-in';
          whiteIconContext.fillStyle = currentColor('--white-100', '#FFFFFF');
          whiteIconContext.fillRect(0, 0, pixelSize, pixelSize);
          whiteIconContext.globalCompositeOperation = 'source-over';
          const iconX = Math.round((labelX + 4) * pixelRatio) / pixelRatio;
          const iconY = Math.round((labelY + 4) * pixelRatio) / pixelRatio;
          context.imageSmoothingEnabled = false;
          context.drawImage(whiteIconCanvas, iconX, iconY, iconCssSize, iconCssSize);
          context.imageSmoothingEnabled = true;
        }
        context.fillStyle = currentColor('--white-100', '#FFFFFF');
        context.fillText(particle.label, labelX + 27, labelY + 12);
        context.restore();
      }

      drawLabel(outgoingLabelParticle, 1 - transitionProgress);
      drawLabel(activeLabelParticle, transitionProgress);

      if (activeLabelParticle) {
        stage.dataset.activeFormatLabel = activeLabelParticle.label;
        stage.dataset.activeFormatColor = formatFocusColor();
      } else {
        delete stage.dataset.activeFormatLabel;
        delete stage.dataset.activeFormatColor;
      }
      if (transitionRaw >= 1) outgoingLabelIndex = null;

      stage.style.cursor = hoveredParticle ? 'pointer' : 'crosshair';
    }

    function frame(now) {
      frameId = 0;
      if (!active || reducedMotion || !visible || document.hidden) return;
      if (lastFrameTime !== null) {
        animationElapsed += Math.min(now - lastFrameTime, 50);
      }
      lastFrameTime = now;
      tiltX += (pointerY - tiltX) * 0.055;
      tiltY += (pointerX - tiltY) * 0.055;
      draw(animationElapsed, animationElapsed);
      frameId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (!active || reducedMotion || !visible || document.hidden || frameId) return;
      lastFrameTime = null;
      frameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const pixelRatio = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(reducedMotion ? 0 : animationElapsed, animationElapsed);
    }

    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      pointerInside = true;
      pointerLocalX = event.clientX - rect.left;
      pointerLocalY = event.clientY - rect.top;
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
      if (reducedMotion) {
        tiltX = pointerY;
        tiltY = pointerX;
        draw(0, 0);
      }
    }, { signal });

    stage.addEventListener('pointerleave', () => {
      pointerInside = false;
      pointerX = 0;
      pointerY = 0;
      stage.style.cursor = 'crosshair';
    }, { signal });

    window.addEventListener('main-palette-change', () => {
      draw(reducedMotion ? 0 : animationElapsed, animationElapsed);
    }, { signal });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(entries => {
      const nextVisible = entries[0].isIntersecting;
      if (nextVisible && introStartedAt === null) {
        introStartedAt = animationElapsed;
        layout?.classList.add('is-format-intro-visible');
      }
      if (nextVisible && !visible) {
        visible = true;
        scheduleAutoLabel();
        startAnimation();
      } else {
        visible = nextVisible;
        if (!visible) {
          clearTimeout(autoLabelTimer);
          stopAnimation();
        }
      }
    }, { threshold: 0 });
    intersectionObserver.observe(stage);

    formatIconImages.forEach(image => {
      image.addEventListener('load', () => {
        draw(reducedMotion ? 0 : animationElapsed, animationElapsed);
      }, { signal });
    });
    resize();
    scheduleAutoLabel();
    startAnimation();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(autoLabelTimer);
        stopAnimation();
      } else {
        scheduleAutoLabel();
        startAnimation();
      }
    }, { signal });
    window.addEventListener('pagehide', stopAnimation, { once: true, signal });
    cleanups.push(() => {
      active = false;
      controller.abort();
      clearTimeout(autoLabelTimer);
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      delete canvas.dataset.formatGlobeOwned;
      delete stage.dataset.activeFormatLabel;
      delete stage.dataset.activeFormatColor;
      stage.style.removeProperty('cursor');
      layout?.classList.remove('is-format-intro-visible');
    });
  }
