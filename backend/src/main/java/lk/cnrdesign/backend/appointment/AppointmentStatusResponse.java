package lk.cnrdesign.backend.appointment;

import lk.cnrdesign.backend.notification.AppointmentMailer;

public record AppointmentStatusResponse(
        String reference, String date, String time, String meetingType, String name, String status) {

    public static AppointmentStatusResponse from(Appointment a) {
        return new AppointmentStatusResponse(
                AppointmentMailer.reference(a.getId()),
                a.getAppointmentDate().toString(),
                a.getAppointmentTime().format(AppointmentService.TIME_FORMAT),
                a.getMeetingType(),
                a.getName(),
                a.getStatus().name());
    }
}
