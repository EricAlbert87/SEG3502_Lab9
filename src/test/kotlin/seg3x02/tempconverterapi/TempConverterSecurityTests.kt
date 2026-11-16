
package seg3x02.tempconverterapi

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class TempConverterSecurityTests(
    @Autowired private val mockMvc: MockMvc
) {

    @Test
    fun sansIdentifiantsRetourne401() {
        mockMvc.perform(
            get("/temperature-converter/celsius-fahrenheit/50")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun user1PeutConvertirEnFahrenheit() {
        mockMvc.perform(
            get("/temperature-converter/celsius-fahrenheit/50")
                .with(httpBasic("user1", "pass1"))
        )
            .andExpect(status().isOk)
            .andExpect(content().string("122.0"))
    }

    @Test
    fun user2PeutConvertirEnCelsius() {
        mockMvc.perform(
            get("/temperature-converter/fahrenheit-celsius/122")
                .with(httpBasic("user2", "pass2"))
        )
            .andExpect(status().isOk)
            .andExpect(content().string("50.0"))
    }

    @Test
    fun mauvaisMotDePasseRetourne401() {
        mockMvc.perform(
            get("/temperature-converter/celsius-fahrenheit/50")
                .with(httpBasic("user1", "mauvais"))
        )
            .andExpect(status().isUnauthorized)
    }
}
