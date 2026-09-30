package lk.cnrdesign.backend.appointment;

import java.util.List;

public record SlotsResponse(String date, List<String> slots) {
}
