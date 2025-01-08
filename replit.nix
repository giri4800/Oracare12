{
  description = "A basic repl.it configuration for Node.js";

  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.yarn
    pkgs.replitPackages.jest
  ];
}
