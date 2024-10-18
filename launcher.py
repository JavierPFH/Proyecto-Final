import subprocess
import sys

def main():
    while True:
        print("Empezando servidor Flask...")
        server = subprocess.Popen([sys.executable, "index.py"], stderr=subprocess.PIPE)

        # Espera al proceso del servidor
        _, stderr = server.communicate()

        if b"Restarting with stat" not in stderr:
            # En caso de que el servidor falle salta del bucle 
            break

        print("Reiniciando servidor Flask...")

if __name__ == "__main__":
    main()
