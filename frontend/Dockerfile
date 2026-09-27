# 1단계: 빌드(Build) 용도
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# 💡 Phase 1에서 설정한 standalone 모드로 뼈대만 남기고 압축 빌드!
RUN npm run build

# 2단계: 실제 실행(Runner) 용도
FROM node:18-alpine AS runner
WORKDIR /app
# 보안을 위해 일반 사용자 계정(root가 아닌) 생성
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# 💡 1단계에서 빌드된 엑기스(standalone) 파일들만 쏙 빼오기 (용량 최소화)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV PORT 3000

# 경량화된 순수 Node.js 서버로 실행
CMD ["node", "server.js"]
