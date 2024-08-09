FROM amazoncorretto:15 AS builder
WORKDIR application
ARG version
ENV VERSION=${version}
ARG JAR_FILE=target/NeedsForecaster-${VERSION}.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM amazoncorretto:15
WORKDIR application
ARG version
ENV VERSION=${version}
ENV ENV dev
EXPOSE 8080

WORKDIR application
COPY --from=builder application/dependencies/ ./
COPY --from=builder application/spring-boot-loader ./
COPY --from=builder application/snapshot-dependencies/ ./
COPY --from=builder application/application/ ./
COPY ./schema ./schema
COPY start.sh ./

RUN yum -y install wget unzip
RUN wget -O ./metabase.jar https://downloads.metabase.com/v0.44.3/metabase.jar

ENTRYPOINT ["./start.sh"]
