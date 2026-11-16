
package seg3x02.tempconverterapi.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class ControllerExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleInvalidNumber(
        ex: MethodArgumentTypeMismatchException
    ): ResponseEntity<String> {
        return ResponseEntity.badRequest()
            .body("La valeur fournie doit être un nombre valide.")
    }
}
