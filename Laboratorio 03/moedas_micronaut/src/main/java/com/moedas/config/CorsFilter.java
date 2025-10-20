package com.moedas.config;

import io.micronaut.context.annotation.Value;
import io.micronaut.context.annotation.Configuration;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.util.CollectionUtils;
import io.micronaut.http.HttpMethod;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.OncePerRequestHttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import jakarta.inject.Singleton;

import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:`http://localhost:3000,http://localhost:8080`}")
    private List<String> allowedOrigins;

    @Singleton
    @Filter("/**")
    public HttpServerFilter corsFilter() {
        return new OncePerRequestHttpServerFilter() {
            @Override
            protected Publisher<MutableHttpResponse<?>> doFilterOnce(HttpRequest<?> request,
                                                                     ServerFilterChain chain) {
                return Flux.from(chain.proceed(request))
                        .map(response -> {
                            MutableHttpResponse<?> mutableResponse = response instanceof MutableHttpResponse
                                    ? (MutableHttpResponse<?>) response
                                    : HttpResponse.ok();

                            // Configuração dos headers CORS
                            String origin = request.getHeaders().getOrigin();

                            if (origin != null && allowedOrigins.contains(origin)) {
                                mutableResponse.header("Access-Control-Allow-Origin", origin);
                            }

                            mutableResponse.header("Access-Control-Allow-Methods",
                                    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                            mutableResponse.header("Access-Control-Allow-Headers",
                                    "*, Authorization, Content-Type, Accept, X-Requested-With");
                            mutableResponse.header("Access-Control-Allow-Credentials", "true");
                            mutableResponse.header("Access-Control-Max-Age", "3600");

                            // Headers expostos
                            mutableResponse.header("Access-Control-Expose-Headers",
                                    "Authorization, Content-Disposition");

                            return mutableResponse;
                        });
            }
        };
    }
}