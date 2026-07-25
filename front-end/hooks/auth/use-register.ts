import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { register } from "@/lib/actions/auth";
import { RegisterFormData, registerSchema } from "../../app/auth/register/register-schema";

export function useRegister() {
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      userName: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    }
  });

  const password = watch("password", "");

  const passwordRequirements = {
    // O schema exige 8+ caracteres, mas o painel de requisitos não mostrava
    // isso: dava pra ver os 4 itens verdes com uma senha curta, clicar em
    // Cadastrar e nada acontecer (o zod barrava em silêncio).
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register(data.fullname, data.userName, data.email, data.password);

      if (result?.success) {
        toast.success("Conta criada com sucesso!");
        router.push("/dashboard");
      } else {
        toast.error(result?.error || "Erro ao realizar o registro");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    }
  };

  const onErrors = () => {
    // Erros de validação já aparecem inline nos campos; nada a logar
    // (logar o objeto de erro é um ralo pronto pra vazar dados de form).
  };

  return {
    registerField,
    handleSubmit: handleSubmit(onSubmit, onErrors),
    control,
    errors,
    isSubmitting,
    password,
    passwordRequirements,
  };
}