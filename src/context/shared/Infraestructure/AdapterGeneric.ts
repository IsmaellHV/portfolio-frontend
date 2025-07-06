import { toast } from 'sonner';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import { SonnerIcon, SonnerPosition } from '../Domain/Types';

export class AdapterGeneric {
  public static isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  public static async createMessage(title: string = '', html: string = '', icon: SweetAlertIcon = 'info', buttonCancel: boolean = false, target: string = 'body') {
    const config: SweetAlertOptions = {
      title: title,
      html: html,
      icon,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      confirmButtonText: 'Aceptar',
      // confirmButtonText: language === 'es' ? 'Aceptar' : language === 'en' ? 'Accept' : 'Accept',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      backdrop: true,
      reverseButtons: false,
      focusConfirm: true,
      target: target,
    };

    if (buttonCancel === true) {
      Object.assign(config, { showCancelButton: true, cancelButtonColor: '#f44336', cancelButtonText: 'Cancelar' });
    }

    const Message = await Swal.fire(config);

    return Reflect.has(Message, 'dismiss') ? false : true;
  }

  public static async createToast({ message, icon, position = 'top-right' }: { message: string; icon: SonnerIcon; position?: SonnerPosition }) {
    toast[icon](message, { position });
  }
}
