package com.moedas.config;

import io.micronaut.http.HttpMethod;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;

@Singleton
@Filter("/**")
public class CorsFilter implements HttpServerFilter {

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        String origin = request.getHeaders().get("Origin");
        String allowedOrigin = getAllowedOrigin(origin);
        
        // Intercepta requisições OPTIONS (preflight)
        if (request.getMethod() == HttpMethod.OPTIONS) {
            MutableHttpResponse<?> response = HttpResponse.ok()
                    .header("Access-Control-Allow-Origin", allowedOrigin)
                    .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
                    .header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With")
                    .header("Access-Control-Allow-Credentials", "true")
                    .header("Access-Control-Max-Age", "3600");
            return Flux.just(response);
        }
        
        // Para outras requisições, processa normalmente e adiciona headers CORS
        return Flux.from(chain.proceed(request))
                .map(response -> {
                    response.getHeaders().add("Access-Control-Allow-Origin", allowedOrigin);
                    response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
                    response.getHeaders().add("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With");
                    response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                    response.getHeaders().add("Access-Control-Max-Age", "3600");
                    return response;
                });
    }
    
    private String getAllowedOrigin(String origin) {
        if (origin == null) {
            return "*";
        }
        // Lista de origens permitidas
        if (origin.startsWith("https://laboratoriodesenvolvimentosoftware.vercel.app") ||
            origin.startsWith("http://localhost:5173") ||
            origin.startsWith("http://localhost:3000")) {
            return origin;
        }
        return "*";
    }
}