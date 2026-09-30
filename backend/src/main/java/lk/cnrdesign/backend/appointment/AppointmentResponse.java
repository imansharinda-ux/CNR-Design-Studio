package lk.cnrdesign.backend.appointment;

public record AppointmentResponse(Long id, String date, String time, String meetingType, String name) {

    public static AppointmentResponse from(Appointment a) {
        return new AppointmentResponse(
                a.getId(),
                a.getAppointmentDate().toString(),
                a.getAppointmentTime().format(AppointmentService.TIME_FORMAT),
                a.getMeetingType(),
                a.getName());
    }
}
