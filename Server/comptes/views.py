from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class MoiVue(APIView):
    """Renvoie les informations du compte connecte (utilise par le front apres connexion)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        utilisateur = request.user
        return Response({
            "id": utilisateur.id,
            "nom_utilisateur": utilisateur.username,
            "email": utilisateur.email,
            "est_staff": utilisateur.is_staff,
            "est_superutilisateur": utilisateur.is_superuser,
        })