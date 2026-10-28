package lk.cnrdesign.backend.enquiry;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import lk.cnrdesign.backend.common.ApiExceptionHandler;
import lk.cnrdesign.backend.common.SpamGuard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

class EnquiryControllerTest {

    private EnquiryService service;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(EnquiryService.class);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mvc = MockMvcBuilders.standaloneSetup(new EnquiryController(service, new SpamGuard(100, 10)))
                .setControllerAdvice(new ApiExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void savesAValidEnquiry() throws Exception {
        when(service.create(any())).thenReturn(new EnquiryResponse(1L, "Nimal Perera", LocalDateTime.of(2026, 10, 1, 10, 0)));

        mvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Nimal Perera\",\"phone\":\"071 234 5678\",\"email\":\"nimal@example.com\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Nimal Perera"));
    }

    @Test
    void explainsWhichFieldsAreWrong() throws Exception {
        mvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"phone\":\"071 234 5678\",\"email\":\"not-an-email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").value("Please enter your name"))
                .andExpect(jsonPath("$.errors.email").value("Please enter a valid email address"));
        verify(service, never()).create(any());
    }

    @Test
    void rejectsBotsThatFillTheHiddenField() throws Exception {
        mvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bot\",\"phone\":\"071 234 5678\",\"email\":\"bot@example.com\",\"website\":\"http://spam\"}"))
                .andExpect(status().isBadRequest());
        verify(service, never()).create(any());
    }
}
