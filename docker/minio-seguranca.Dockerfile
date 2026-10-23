# Troca só a lista de certificados da última imagem do minio (caso eMudhra, 23/10/2026).
#   docker tag minio/minio:latest minio/minio:pre-emudhra
#   docker build -t minio/minio:latest -f docker/minio-seguranca.Dockerfile docker/
FROM alpine:latest AS novo
FROM minio/minio:pre-emudhra
COPY --from=novo /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
