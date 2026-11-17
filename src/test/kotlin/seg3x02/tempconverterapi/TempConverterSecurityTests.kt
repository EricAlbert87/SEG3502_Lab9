
package seg3x02.tempconverterapi

import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.ValueSource
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

    @ParameterizedTest
    @ValueSource(strings = [
        "/temperature-converter/celsius-fahrenheit/50",
        "/temperature-converter/fahrenheit-celsius/122"
    ])
    fun sansIdentifiantsRetourne401(url: String) {
        mockMvc.perform(
            get(url)
        )
            .andExpect(status().isUnauthorized)
    }

    @ParameterizedTest
    @CsvSource(
        "user1, pass1, /temperature-converter/celsius-fahrenheit/50, 122.0",
        "user1, pass1, /temperature-converter/fahrenheit-celsius/122, 50.0",
        "user2, pass2, /temperature-converter/celsius-fahrenheit/50, 122.0",
        "user2, pass2, /temperature-converter/fahrenheit-celsius/122, 50.0"
    )
    fun chaqueUtilisateurPeutAccederAuxDeuxConversions(
        utilisateur: String,
        motDePasse: String,
        url: String,
        resultatAttendu: String
    ) {
        mockMvc.perform(
            get(url)
                .with(httpBasic(utilisateur, motDePasse))
        )
            .andExpect(status().isOk)
            .andExpect(content().string(resultatAttendu))
    }

    @ParameterizedTest
    @ValueSource(strings = [
        "/temperature-converter/celsius-fahrenheit/50",
        "/temperature-converter/fahrenheit-celsius/122"
    ])
    fun mauvaisMotDePasseRetourne401(url: String) {
        mockMvc.perform(
            get(url)
                .with(httpBasic("user1", "mauvais"))
        )
            .andExpect(status().isUnauthorized)
    }

    @ParameterizedTest
    @ValueSource(strings = [
        "/temperature-converter/celsius-fahrenheit/50",
        "/temperature-converter/fahrenheit-celsius/122"
    ])
    fun utilisateurInconnuRetourne401(url: String) {
        mockMvc.perform(
            get(url)
                .with(httpBasic("inconnu", "pass1"))
        )
            .andExpect(status().isUnauthorized)
    }

    @ParameterizedTest
    @ValueSource(strings = [
        "/temperature-converter/celsius-fahrenheit/abc",
        "/temperature-converter/fahrenheit-celsius/abc"
    ])
    fun valeurNonNumeriqueRetourne400AvecMessageEnFrancais(url: String) {
        mockMvc.perform(
            get(url)
                .with(httpBasic("user1", "pass1"))
        )
            .andExpect(status().isBadRequest)
            .andExpect(content().string("La valeur fournie doit être un nombre valide."))
    }
}
