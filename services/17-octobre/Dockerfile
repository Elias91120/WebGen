# 17 OCTOBRE file server (Coolify app "17-octobre-fichiers", base directory /services/17-octobre).
FROM node:22-alpine
WORKDIR /app
COPY server.mjs relay.mjs ws.mjs classement.mjs noms.mjs mesure.mjs ligue.mjs fantomes.mjs ajouts.json ./
ENV PORT=3000 DATA_DIR=/data
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.mjs"]
