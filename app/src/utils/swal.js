
import Swal from 'sweetalert2';

export const swalDeleteForm = callback => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        background: '#000',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalConfirm = ({title = 'Are you sure?', callback}) => {
    Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        background: '#000',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes! dot it!'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalError = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: true
    });
}

export const swalSuccess = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 800
    });
}

export const swalInfo = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: true
    });
}

export const swalLoading = () => {
    Swal.fire({
        title: 'Loading...',
        text: "Please wait.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}

export const swalUploading = () => {
    Swal.fire({
        title: 'Uploading files...',
        text: "Please wait. This may take a while depending on upload size.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}
