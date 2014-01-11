#!/usr/bin/perl -w

# Partially borrowed from http://www.rocketaware.com/perl/perlfaq5/How_can_I_read_a_single_characte.htm

use strict;

sub usage {
  print "$0 [normal | extended | urxvt]\n";
  exit 1;
}

sub resetMouse {
  print STDERR "\e[?1000l\e[?1005l\e[?1015l";
}

sub printMouseData {
  my ($button, $row, $col) = @_;
  my $bstr = "";
  if (($button & 0x3) == 0) {
    $bstr = ($button & 0x40) ? "WHEELUP" : "LEFT";
  } elsif (($button & 0x3) == 1) {
    $bstr = ($button & 0x40) ? "WHEELDOWN" : "MIDDLE";
  } elsif (($button & 0x3) == 2) {
    $bstr = "RIGHT";
  } elsif (($button & 0x3) == 3) {
    $bstr = "RELEASED";
  }
  if ($button & 0x4) {
    $bstr = "shift-" . $bstr;
  }
  if ($button & 0x8) {
    $bstr = "meta-" . $bstr;
  }
  if ($button & 0x10) {
    $bstr = "ctrl-" . $bstr;
  }
  printf "[col=%d row=%d] %s\n", $col, $row, $bstr;
}

sub readUTF8 {
  my ($first) = @_;
  if ($first <= 0x7F) {
    return $first & 0x7F;
  } elsif ($first >= 0xC2 && $first <= 0xDF) {
    my $second = ord(getone());
    return (($first & 0x1F) << 6) | ($second & 0x3F);
  } elsif ($first >= 0xE0 && $first <= 0xEF) {
    my $second = ord(getone());
    my $third = ord(getone());
    return (($first & 0xF) << 12) | (($second & 0x3F) << 6) & ($third & 0x3F);
  } elsif ($first >= 0xF0 && $first <= 0xF4) {
    my $second = ord(getone());
    my $third = ord(getone());
    my $fourth = ord(getone());
    return (($first & 0x7) << 18) | (($second & 0x3F) << 12) & (($third & 0x3F) << 6) & ($fourth & 0x3F);
  }
}

sub readURXVT {
  my $c = chr(shift);
  my $str;
  while ($c ne ";" && $c ne "M")  {
    $str .= $c;
    $c = getone();
  }
  return $str;
}

usage() unless $#ARGV == 0;

$SIG{'INT'} = sub { resetMouse(); exit(0); };

if ("normal" eq $ARGV[0]) {
  print "Listening for Xterm style mouse reporting. ^C to exit.\n";
  print STDERR "\e[?1000h";
  my ($char, $state, $button, $row, $col);
  while (1) {
    $char = ord(getone());
    if ($char == 27) {
      $state = 1;
    } elsif ($state == 1 && $char == 91) {
      $state = 2;
    } elsif ($state == 2 && $char == 77) {
      $state = 3;
    } elsif ($state == 3) {
      $button = $char - 32;
      $state = 4;
    } elsif ($state == 4) {
      $col = $char - 32;
      $state = 5;
    } elsif ($state == 5) {
      $row = $char - 32;
      $state = 0;
      printMouseData($button, $row, $col);
    }
  }
} elsif ("extended" eq $ARGV[0]) {
  print "Listening for EXTENDED Xterm (1005) style mouse reporting. ^C to exit.\n";
  print STDERR "\e[?1005h\e[?1000h";
  my ($char, $state, $button, $row, $col);
  while (1) {
    $char = ord(getone());
    if ($char == 27) {
      $state = 1;
    } elsif ($state == 1 && $char == 91) {
      $state = 2;
    } elsif ($state == 2 && $char == 77) {
      $state = 3;
    } elsif ($state == 3) {
      $button = readUTF8($char) - 32;
      $state = 4;
    } elsif ($state == 4) {
      $col = readUTF8($char) - 32;
      $state = 5;
    } elsif ($state == 5) {
      $row = readUTF8($char) - 32;
      $state = 0;
      printMouseData($button, $row, $col);
    }
  }
} elsif ("urxvt" eq $ARGV[0]) {
  print "Listening for URXVT (1015) style mouse reporting. ^C to exit.\n";
  print STDERR "\e[?1015h\e[?1000h";
  my ($char, $state, $button, $row, $col);
  while (1) {
    $char = ord(getone());
    if ($char == 27) {
      $state = 1;
    } elsif ($state == 1 && $char == 91) {
      $state = 3;
    } elsif ($state == 3) {
      $button = readURXVT($char) - 32;
      $state = 4;
    } elsif ($state == 4) {
      $col = readURXVT($char);
      $state = 5;
    } elsif ($state == 5) {
      $row = readURXVT($char);
      $state = 0;
      printMouseData($button, $row, $col);
    }
  }
} else {
  usage();
}

BEGIN {
    use POSIX qw(:termios_h);
    my ($term, $oterm, $echo, $noecho, $fd_stdin);
    $fd_stdin = fileno(STDIN);
    $term     = POSIX::Termios->new();
    $term->getattr($fd_stdin);
    $oterm     = $term->getlflag();
    $echo     = ECHO | ECHOK | ICANON;
    $noecho   = $oterm & ~$echo;
    sub cbreak {
        $term->setlflag($noecho);
        $term->setcc(VTIME, 1);
        $term->setattr($fd_stdin, TCSANOW);
    }
    sub cooked {
        $term->setlflag($oterm);
        $term->setcc(VTIME, 0);
        $term->setattr($fd_stdin, TCSANOW);
    }
    sub getone {
        my $key = '';
        cbreak();
        sysread(STDIN, $key, 1);
        cooked();
        return $key;
    }
}
END { cooked() }
