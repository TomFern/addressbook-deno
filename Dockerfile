FROM debian:buster
RUN apt-get update \
        && apt-get install -y --no-install-recommends ca-certificates curl unzip netcat \
        && rm -rf /var/cache/apt/archives
RUN groupadd --gid 1000 deno \
  && useradd --uid 1000 --gid deno --shell /bin/bash --create-home deno
USER deno
RUN curl -fsSL -k https://deno.land/x/install/install.sh | sh
ENV HOME "/home/deno"
ENV DENO_INSTALL "${HOME}/.deno"
ENV PATH "${DENO_INSTALL}/bin:${PATH}"
RUN mkdir -p $HOME/app/src
COPY --chown=deno:deno src/ $HOME/app/src
WORKDIR $HOME/app/src
RUN deno cache deps.ts
CMD deno run --allow-env --allow-net app.js
